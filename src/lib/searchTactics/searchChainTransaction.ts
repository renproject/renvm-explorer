import {
    RenVMProvider,
    RPCMethod,
    RPCResponses,
    unmarshalRenVMTransaction,
} from "@renproject/provider";
import RenJS from "@renproject/ren";
import { Chain, utils } from "@renproject/utils";

import { DEBUG } from "../../environmentVariables";
import { allChains } from "../chains/chains";
import {
    RenVMTransaction,
    SummarizedTransaction,
    TransactionType,
} from "../searchResult";
import { summarizeTransaction } from "./searchRenVMHash";
import { SearchTactic } from "./searchTactic";

const queryTxsByTxid = async (
    provider: RenVMProvider,
    txid: Buffer,
    getChain: (chainName: string) => Chain | null,
): Promise<Array<SummarizedTransaction>> => {
    const response: { txs: Array<RPCResponses[RPCMethod.QueryTx]["tx"]> } =
        await provider.sendMessage(
            "ren_queryTxsByTxid" as any,
            { txid: utils.toURLBase64(txid) },
            1,
        );

    if (response.txs.length === 0) {
        throw new Error(`Transaction not found.`);
    }

    return await Promise.all(
        response.txs.map(async (tx) => {
            const unmarshalled = unmarshalRenVMTransaction(tx);
            return {
                result: unmarshalled,
                transactionType: TransactionType.Mint as const,
                summary: await summarizeTransaction(unmarshalled, getChain),
            };
        }),
    );
};

const OR = (left: boolean, right: boolean) => left || right;

export const searchChainTransaction: SearchTactic<RenVMTransaction> = {
    match: (
        searchString: string,
        getChain: (chainName: string) => Chain | null,
    ) =>
        allChains
            .map((chain) => getChain(chain.chain))
            .map((chain) =>
                utils.doesntError(() =>
                    chain
                        ? chain.validateTransaction({ txHash: searchString })
                        : false,
                )(),
            )
            .reduce(OR, false),
    search: async (
        searchString: string,
        updateStatus: (status: string) => void,
        getChain: (chainName: string) => Chain | null,
        renJS: RenJS,
    ): Promise<RenVMTransaction[]> => {
        const formats = Array.from(
            // Remove duplicates.
            new Set(
                allChains
                    .map((chain) => getChain(chain.chain))
                    .map((chain) => {
                        try {
                            return chain &&
                                chain.validateTransaction({
                                    txHash: searchString,
                                })
                                ? chain.txidFormattedToTxid(searchString)
                                : null;
                        } catch (error) {
                            if (DEBUG) {
                                console.error(error);
                            }
                        }
                        return null;
                    })
                    .filter((txid) => txid !== null),
            ),
        ).map((x) => (x !== null ? Buffer.from(x, "base64") : null));

        if (formats.length) {
            updateStatus(
                `Looking up ${formats.length} chain transaction format${
                    formats.length === 1 ? "" : "s"
                }...`,
            );
        } else {
            return [];
        }

        let queryTxs;
        for (const format of formats) {
            try {
                queryTxs = await queryTxsByTxid(
                    renJS.provider,
                    format!,
                    getChain,
                );
                break;
            } catch (error: any) {
                continue;
            }
        }

        if (!queryTxs) {
            throw new Error(`No result found.`);
        }

        return queryTxs.map((queryTx) => RenVMTransaction(queryTx.result.hash));
    },
};
