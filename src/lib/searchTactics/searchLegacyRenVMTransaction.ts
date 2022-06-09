import {
    RenVMProvider,
    RenVMTransaction,
    RenVMTransactionWithStatus,
    RPCMethod,
} from "@renproject/provider";
import { Chain } from "@renproject/utils";

import { NETWORK } from "../../environmentVariables";
import { LegacyRenVMTransaction, RenVMTransactionError } from "../searchResult";
import { errorMatches, TaggedError } from "../taggedError";
import { isBase64 } from "./common";
import { SearchTactic } from "./searchTactic";

export const queryMintOrBurn = async (
    provider: RenVMProvider,
    transactionHash: string,
    getChain: (chainName: string) => Chain | null,
): Promise<any> => {
    try {
        return await provider.sendMessage(RPCMethod.QueryTx, {
            txHash: transactionHash,
        });
    } catch (error: any) {
        if (errorMatches(error, "not found")) {
            throw new TaggedError(
                error,
                RenVMTransactionError.TransactionNotFound,
            );
        }
        throw error;
    }
};

export const searchLegacyRenVMTransaction: SearchTactic<LegacyRenVMTransaction> =
    {
        match: (searchString: string) =>
            isBase64(searchString, {
                length: 32,
            }),

        search: async (
            searchString: string,
            updateStatus: (status: string) => void,
            getChain: (chainName: string) => Chain | null,
        ): Promise<LegacyRenVMTransaction> => {
            updateStatus("Looking up legacy RenVM hash...");

            const provider = new RenVMProvider(NETWORK);

            await queryMintOrBurn(provider, searchString, getChain);

            return LegacyRenVMTransaction(searchString);
        },
    };
