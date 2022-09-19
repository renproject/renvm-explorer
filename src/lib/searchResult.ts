import { RenVMCrossChainTransaction } from "@renproject/provider";
import { Gateway, GatewayTransaction } from "@renproject/ren";
import { ChainCommon, TxStatus } from "@renproject/utils";
import BigNumber from "bignumber.js";
import { v4 as uuid } from "uuid";

export enum SearchResultType {
    Searching = "Searching",

    /**
     * Redirect represents a generic search result that points to a new url. This
     * URL can be a relative URL or it can point to an external website. Its ID is
     * the URL.
     */
    Redirect = "Redirect",
    /**
     * RenVMTransaction represents a mint or burn. Its ID is a RenVM hash.
     */
    RenVMTransaction = "Transaction",

    /**
     * RenVMTransaction represents a mint or burn. Its ID is a RenVM hash.
     */
    LegacyRenVMTransaction = "Legacy Tx",

    /**
     * RenVMGateway represents a gateway address. Its ID is the address.
     */
    RenVMGateway = "Gateway",
}

interface SearchResultCommon {
    uuid: string;

    type: SearchResultType;
    label: string;
    resultPath: string;
}

// Searching ////////////////////////////////////////////////////////////////////

export interface Searching extends SearchResultCommon {
    type: SearchResultType.Searching;
    label: string;
    resultPath: string;
    searchString: string;

    noResult?: boolean;
    errorSearching?: Error;
    multipleResults?: SearchResult[];
}

/* eslint-disable @typescript-eslint/no-redeclare */
export const Searching = (
    searchString: string,
    details?: Partial<Searching>,
): Searching => ({
    uuid: uuid(),
    type: SearchResultType.Searching,
    searchString,
    label: searchString,
    resultPath: `/search/${encodeURIComponent(searchString)}`,
    ...details,
});

// RenVMTransaction ////////////////////////////////////////////////////////////

export enum RenVMTransactionError {
    TransactionNotFound = "transaction-not-found",
}

export interface TransactionSummary {
    asset: string;
    assetShort: string;
    assetLabel: string;

    from: string;
    fromLabel: string;
    fromLabelShort: string;
    fromChain?: ChainCommon;

    to: string;
    toLabel: string;
    toLabelShort: string;
    toChain?: ChainCommon;

    decimals?: number;
    amountIn?: BigNumber;
    amountInRaw?: BigNumber;

    amountOut?: BigNumber;
    amountOutRaw?: BigNumber;

    inTx?: {
        txHash: string;
        explorerLink: string;
    };
    outTx?: {
        txHash: string;
        explorerLink: string;
    };
}

export enum TransactionType {
    Mint = "mint",
    Burn = "burn",
    ClaimFees = "claimFees",
}

export type SummarizedTransaction =
    | {
          result: RenVMCrossChainTransaction & { status?: TxStatus };
          summary: TransactionSummary;
          transactionType: TransactionType.Mint;
      }
    | {
          result: any;
          summary: TransactionSummary;
          transactionType: TransactionType.ClaimFees;
      };

export interface RenVMTransaction extends SearchResultCommon {
    type: SearchResultType.RenVMTransaction;
    label: string;
    resultPath: string;
    txHash: string;
    queryTx?: SummarizedTransaction | Error;
    deposit?: GatewayTransaction;
}

export const RenVMTransaction = (
    transactionHash: string,
    queryTx?: SummarizedTransaction | Error,
    deposit?: GatewayTransaction,
): RenVMTransaction => {
    return {
        uuid: uuid(),
        type: SearchResultType.RenVMTransaction,
        label: transactionHash,
        resultPath: `/tx/${encodeURIComponent(transactionHash)}`,
        txHash: transactionHash,
        queryTx,
        deposit,
    };
};

// // LegacyRenVMTransaction //////////////////////////////////////////////////////

export interface LegacyRenVMTransaction extends SearchResultCommon {
    type: SearchResultType.LegacyRenVMTransaction;
    label: string;
    resultPath: string;
    txHash: string;
    queryTx?: SummarizedTransaction | Error;
    deposit?: GatewayTransaction;
}

export const LegacyRenVMTransaction = (
    transactionHash: string,
): LegacyRenVMTransaction => {
    return {
        uuid: uuid(),
        type: SearchResultType.LegacyRenVMTransaction,
        label: transactionHash,
        resultPath: `https://renproject.github.io/renvm-explorer-legacy/#/legacy-tx/${encodeURIComponent(
            transactionHash,
        )}`,
        txHash: transactionHash,
    };
};

// // RenVMGateway ////////////////////////////////////////////////////////////

export interface RenVMGateway extends SearchResultCommon {
    type: SearchResultType.RenVMGateway;
    label: string;
    resultPath: string;
    address: string;
    queryGateway?: {
        result: RenVMCrossChainTransaction;
        transactionType: TransactionType.Mint;
        summary: TransactionSummary;
    };
    lockAndMint?: Gateway;
}

export const RenVMGateway = (
    address: string,
    queryGateway?: {
        result: RenVMCrossChainTransaction;
        transactionType: TransactionType.Mint;
        summary: TransactionSummary;
    },
    lockAndMint?: Gateway,
): RenVMGateway => {
    return {
        uuid: uuid(),
        type: SearchResultType.RenVMGateway,
        label: address,
        resultPath: `/gateway/${encodeURIComponent(address)}`,
        address,
        queryGateway,
        lockAndMint,
    };
};

////////////////////////////////////////////////////////////////////////////////

export type SearchResult =
    | Searching
    | RenVMTransaction
    | LegacyRenVMTransaction
    | RenVMGateway;
