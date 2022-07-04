import { Ethereum } from "@renproject/chains-ethereum";
import { RenVMCrossChainTransaction } from "@renproject/provider";
import RenJS, { Gateway } from "@renproject/ren";
import { TransactionParams } from "@renproject/ren//params";
import { Chain, ContractChain, utils } from "@renproject/utils";
import BigNumber from "bignumber.js";

import { getContractChainParams } from "./chains/chains";
import { RenVMTransaction, TransactionSummary } from "./searchResult";
import { queryMintOrBurn } from "./searchTactics/searchRenVMHash";

export const searchTransaction = async (
    transaction: RenVMTransaction,
    getChain: (chainName: string) => Chain | null,
    renJS: RenJS,
): Promise<RenVMTransaction | null> => {
    if (!transaction.queryTx) {
        transaction.queryTx = await queryMintOrBurn(
            renJS.provider,
            transaction.txHash,
            getChain,
        );
    }

    return transaction;
};

export const getTransactionDepositInstance = async (
    renJS: RenJS,
    searchDetails: RenVMCrossChainTransaction,
    summary: TransactionSummary,
) => {
    const inputs = searchDetails.in as unknown as {
        amount: BigNumber;
        ghash: string;
        gpubkey: string;
        nhash: string;
        nonce: string;
        payload: string;
        phash: string;
        to: string;
        txid: string;
        txindex: string;
    };

    if (!summary.fromChain) {
        throw new Error(
            `Fetching transaction details not supported yet for ${summary.from}.`,
        );
    }

    if (!summary.toChain) {
        throw new Error(
            `Fetching transaction details not supported yet for ${summary.to}.`,
        );
    }

    const txid = utils.toURLBase64(searchDetails.in.txid);
    const txParams: TransactionParams = {
        asset: summary.asset,
        fromTx: {
            asset: summary.asset,
            chain: summary.from,
            txid,
            explorerLink:
                (summary.fromChain &&
                    summary.fromChain.transactionExplorerLink({ txid })) ||
                "",
            txHash: summary.fromChain.txHashFromBytes(searchDetails.in.txid),
            // FIXME!
            txindex: searchDetails.in.txindex.toFixed(),
            amount: searchDetails.in.amount.toFixed(),
        },
        shard: {
            gPubKey: utils.toURLBase64(searchDetails.in.gpubkey),
        },
        nonce: utils.toURLBase64(searchDetails.in.nonce),
        to: await getContractChainParams(
            summary.toChain as ContractChain,
            inputs.to,
            (inputs.payload as Uint8Array | string) instanceof Uint8Array
                ? utils.toHex(inputs.payload as unknown as Uint8Array)
                : inputs.payload,
            summary.asset,
        ),
    };

    const deposit = await renJS.gatewayTransaction(txParams);

    try {
        await deposit.renVM.query();
    } catch (error) {
        console.error(error);
    }

    // deposit.renVM.submit().catch(console.error);

    let gateway: Gateway | undefined;

    if (summary.fromChain) {
        gateway = await renJS.gateway({
            asset: txParams.asset,
            from: (summary.fromChain as Ethereum).Transaction({
                txid: utils.toURLBase64(searchDetails.in.txid),
                txindex: searchDetails.in.txindex.toFixed(),
            }),
            to: txParams.to,
        });
    }

    if (deposit.hash !== searchDetails.hash) {
        console.group(
            `Expected ${deposit.hash} to equal ${searchDetails.hash}.`,
        );
        console.debug("expected", searchDetails);
        console.debug("actual", await deposit.renVM.export());
        console.groupEnd();
        // await deposit.renVM.submit();
    }

    return {
        deposit,
        gateway,
    };
};
