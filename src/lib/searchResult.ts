import {
  LockAndMintTransaction,
  BurnAndReleaseTransaction,
  ChainCommon,
} from "@renproject/interfaces";
import BigNumber from "bignumber.js";

export enum SearchResultType {
  NoResult,

  /**
   * Redirect represents a generic search result that points to a new url. This
   * URL can be a relative URL or it can point to an external website. Its ID is
   * the URL.
   */
  Redirect,
  /**
   * RenVMTransaction represents a mint or burn. Its ID is a RenVM hash.
   */
  RenVMTransaction,

  /**
   * RenVMTransaction represents a mint or burn. Its ID is a RenVM hash.
   */
  LegacyRenVMTransaction,

  /**
   * RenVMGateway represents a gateway address. Its ID is the address.
   */
  RenVMGateway,
}

export interface SearchResultCommon {
  type: SearchResultType;
  resultPath: string;
}

// NoResult ////////////////////////////////////////////////////////////////////

export interface NoResult extends SearchResultCommon {
  type: SearchResultType.NoResult;
  resultPath: string;
}

/* eslint-disable @typescript-eslint/no-redeclare */
export const NoResult: NoResult = {
  type: SearchResultType.NoResult,
  resultPath: "/404",
};

// Redirect ////////////////////////////////////////////////////////////////////

export interface Redirect extends SearchResultCommon {
  type: SearchResultType.Redirect;
  resultPath: string;
}

export const Redirect = (resultPath: string): Redirect => {
  return {
    type: SearchResultType.Redirect,
    resultPath,
  };
};

// RenVMTransaction ////////////////////////////////////////////////////////////

export enum RenVMTransactionError {
  TransactionNotFound = "transaction-not-found",
}

export interface TransactionSummary {
  asset: string;

  from: string;
  fromChain?: ChainCommon;

  to: string;
  toChain?: ChainCommon;

  amountIn?: BigNumber;
  amountInRaw: BigNumber;

  amountOut?: BigNumber;
  amountOutRaw?: BigNumber;
}

export interface RenVMTransaction extends SearchResultCommon {
  type: SearchResultType.RenVMTransaction;
  resultPath: string;
  txHash: string;
  queryTx?:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      }
    | Error;
}

export const RenVMTransaction = (
  transactionHash: string,
  queryTx?:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      }
    | Error
): RenVMTransaction => {
  return {
    type: SearchResultType.RenVMTransaction,
    resultPath: `/tx/${encodeURIComponent(transactionHash)}`,
    txHash: transactionHash,
    queryTx,
  };
};

// LegacyRenVMTransaction //////////////////////////////////////////////////////

export interface LegacyRenVMTransaction extends SearchResultCommon {
  type: SearchResultType.LegacyRenVMTransaction;
  resultPath: string;
  txHash: string;
  queryTx?:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      }
    | Error;
}

export const LegacyRenVMTransaction = (
  transactionHash: string,
  queryTx?:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      }
    | Error
): LegacyRenVMTransaction => {
  return {
    type: SearchResultType.LegacyRenVMTransaction,
    resultPath: `/legacy-tx/${encodeURIComponent(transactionHash)}`,
    txHash: transactionHash,
    queryTx,
  };
};

// RenVMGateway ////////////////////////////////////////////////////////////

export interface RenVMGateway extends SearchResultCommon {
  type: SearchResultType.RenVMGateway;
  resultPath: string;
  address: string;
  queryGateway?: LockAndMintTransaction;
}

export const RenVMGateway = (
  address: string,
  queryGateway?: LockAndMintTransaction
): RenVMGateway => {
  return {
    type: SearchResultType.RenVMGateway,
    resultPath: `/address/${encodeURIComponent(address)}`,
    address,
    queryGateway,
  };
};

////////////////////////////////////////////////////////////////////////////////

export type SearchResult =
  | NoResult
  | Redirect
  | RenVMTransaction
  | LegacyRenVMTransaction
  | RenVMGateway;
