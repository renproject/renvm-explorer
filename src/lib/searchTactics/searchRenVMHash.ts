import { isURLBase64 } from "./common";
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
} from "@renproject/rpc/build/main/v2";
import { NETWORK } from "../../environmentVariables";
import {
  RenVMTransaction,
  RenVMTransactionError,
  TransactionSummary,
} from "../searchResult";
import BigNumber from "bignumber.js";
import { toReadable } from "@renproject/utils";
import { errorMatches, TaggedError } from "../taggedError";

/**
 * parseV1Selector splits a RenVM contract (e.g. `BTC0Eth2Btc`) into the asset
 * (`BTC`), the origin chain (`Eth`) and the target chain (`Btc`).
 */
export const parseV2Selector = (selector: string) => {
  const maybeMint = selector.split("/to");
  if (maybeMint.length === 2) {
    return {
      asset: maybeMint[0],
      from: maybeMint[0],
      to: maybeMint[1],
    };
  }

  const maybeBurn = selector.split("/from");
  if (maybeBurn.length === 2) {
    return {
      asset: maybeBurn[0],
      from: maybeBurn[1],
      to: maybeBurn[0],
    };
  }

  throw new Error(`Unable to parse v2 selector ${selector}`);
};

export const summarizeTransaction = async (
  searchDetails: LockAndMintTransaction | BurnAndReleaseTransaction,
  getChain: (chainName: string) => ChainCommon | null
): Promise<TransactionSummary> => {
  const { to, from, asset } = parseV2Selector(searchDetails.to);

  const fromChain = getChain(from);
  const toChain = getChain(to);

  let amountInRaw: BigNumber | undefined;
  let amountIn: BigNumber | undefined;
  let amountOutRaw: BigNumber | undefined;
  let amountOut: BigNumber | undefined;

  if (
    (searchDetails.in as any).amount &&
    !(searchDetails.in as any).amount.isNaN()
  ) {
    amountInRaw = new BigNumber((searchDetails.in as any).amount);
  }

  if (amountInRaw && fromChain) {
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

  const isMint = /((\/to)|(To))/.exec(response.tx.selector);

  // Unmarshal transaction.
  if (isMint) {
    const unmarshalled = unmarshalMintTx(response);
    return {
      result: unmarshalled,
      isMint: true,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
  } else {
    const unmarshalled = unmarshalBurnTx(response);
    return {
      result: unmarshalled,
      isMint: false,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
  }
};

export const searchRenVMHash: SearchTactic<RenVMTransaction> = {
  match: (searchString: string) =>
    isURLBase64(searchString, {
      length: 32,
    }),

  search: async (
    searchString: string,
    updateStatus: (status: string) => void,
    getChain: (chainName: string) => ChainCommon | null
  ): Promise<RenVMTransaction> => {
    updateStatus("Looking up RenVM hash...");

    const provider = new RenVMProvider(NETWORK);

    let queryTx = await queryMintOrBurn(provider, searchString, getChain);

    return RenVMTransaction(searchString, queryTx);
  },
};
