import { isBase64 } from "./common";
import { SearchTactic } from "./searchTactic";
import {
  LockAndMintTransaction,
  BurnAndReleaseTransaction,
  ChainCommon,
} from "@renproject/interfaces";
import {
  RenVMProvider,
  unmarshalMintTx,
  unmarshalBurnTx,
  ResponseQueryTx,
  ResponseQueryMintTx,
  ResponseQueryBurnTx,
} from "@renproject/rpc/build/main/v1";
import { NETWORK } from "../../environmentVariables";
import {
  LegacyRenVMTransaction,
  RenVMTransactionError,
  TransactionSummary,
} from "../searchResult";
import BigNumber from "bignumber.js";
import { parseV1Selector, toReadable } from "@renproject/utils";
import { errorMatches, TaggedError } from "../taggedError";

export const summarizeTransaction = async (
  searchDetails: LockAndMintTransaction | BurnAndReleaseTransaction,
  getChain: (chainName: string) => ChainCommon | null
): Promise<TransactionSummary> => {
  const { to, from, asset } = parseV1Selector(searchDetails.to);

  const fromChain = getChain(from);
  const toChain = getChain(to);

  const isMint = asset.toUpperCase() === from.toUpperCase();

  let amountInRaw: BigNumber = isMint
    ? Buffer.from((searchDetails.in as any).utxo.amount)
    : (searchDetails.in as any).amount;
  let amountIn: BigNumber | undefined;
  let amountOutRaw: BigNumber | undefined;
  let amountOut: BigNumber | undefined;

  if (fromChain) {
    amountIn = toReadable(amountInRaw, await fromChain.assetDecimals(asset));
    if (
      searchDetails.out &&
      searchDetails.out.revert === undefined &&
      (searchDetails.out as any).amount
    ) {
      amountOutRaw = new BigNumber((searchDetails.out as any).amount);
      amountOut = toReadable(
        amountOutRaw,
        await fromChain.assetDecimals(asset)
      );
    }
  }

  return {
    asset,
    to,
    toChain: toChain || undefined,

    from,
    fromChain: fromChain || undefined,

    amountIn,
    amountInRaw,

    amountOut,
    amountOutRaw,
  };
};

export const queryMintOrBurn = async (
  provider: RenVMProvider,
  transactionHash: string,
  getChain: (chainName: string) => ChainCommon | null
): Promise<
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
> => {
  let response: ResponseQueryTx;
  try {
    response = await provider.queryTx(transactionHash, 1);
  } catch (error) {
    if (errorMatches(error, "not found")) {
      throw new TaggedError(error, RenVMTransactionError.TransactionNotFound);
    }
    throw error;
  }

  const { asset, from } = parseV1Selector(response.tx.to);
  const isMint = asset.toUpperCase() === from.toUpperCase();

  // Unmarshal transaction.
  if (isMint) {
    const unmarshalled = unmarshalMintTx(response as ResponseQueryMintTx);
    return {
      result: unmarshalled,
      isMint: true,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
  } else {
    const unmarshalled = unmarshalBurnTx(response as ResponseQueryBurnTx);
    return {
      result: unmarshalled,
      isMint: false,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
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
      getChain: (chainName: string) => ChainCommon | null
    ): Promise<LegacyRenVMTransaction> => {
      updateStatus("Looking up legacy RenVM hash...");

      const provider = new RenVMProvider(NETWORK);

      let queryTx = await queryMintOrBurn(provider, searchString, getChain);

      return LegacyRenVMTransaction(searchString, queryTx);
    },
  };
