import BigNumber from "bignumber.js";

import {
  RenVMCrossChainTransaction,
  RenVMProvider,
  ResponseQueryTx,
  RPCMethod,
  unmarshalRenVMTransaction,
} from "@renproject/provider";
import { Chain } from "@renproject/utils";

import { NETWORK } from "../../environmentVariables";
import {
  RenVMTransaction,
  RenVMTransactionError,
  SummarizedTransaction,
  TransactionSummary,
  TransactionType,
} from "../searchResult";
import { errorMatches, TaggedError } from "../taggedError";
import { unmarshalClaimFeesTx } from "../unmarshalClaimFees";
import { isURLBase64 } from "./common";
import { SearchTactic } from "./searchTactic";

const RenVMChain = "RenVM";

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

  const maybeClaimFees = /(.*)\/claimFees/.exec(selector);
  if (maybeClaimFees) {
    const asset = maybeClaimFees[1];
    return {
      asset,
      from: RenVMChain,
      to: asset,
    };
  }

  throw new Error(`Unable to parse v2 selector ${selector}`);
};

export const summarizeTransaction = async (
  searchDetails: RenVMCrossChainTransaction,
  getChain: (chainName: string) => Chain | null
): Promise<TransactionSummary> => {
  let { to, from, asset } = parseV2Selector(searchDetails.selector);

  const fromChain = getChain(from);
  from = fromChain ? fromChain.chain : from;
  const toChain = getChain(to);
  to = toChain ? toChain.chain : to;

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

  let chain;
  if (fromChain && (await fromChain.isLockAsset(asset))) {
    chain = fromChain;
  } else {
    chain = toChain;
  }

  try {
    if (amountInRaw && chain) {
      amountIn = amountInRaw.shiftedBy(-(await chain.assetDecimals(asset)));
      if (
        searchDetails.out &&
        (searchDetails.out.revert === undefined ||
          searchDetails.out.revert.length === 0) &&
        (searchDetails.out as any).amount
      ) {
        amountOutRaw = new BigNumber((searchDetails.out as any).amount);
        amountOut = amountOutRaw.shiftedBy(-(await chain.assetDecimals(asset)));
      }
    }
  } catch (error) {
    // Ignore error.
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

export const unmarshalTransaction = async (
  response: ResponseQueryTx,
  getChain: (chainName: string) => Chain | null
): Promise<SummarizedTransaction> => {
  const isMint = /((\/to)|(To))/.exec(response.tx.selector);
  const isClaim = /\/claimFees/.exec(response.tx.selector);

  // Unmarshal transaction.
  if (isClaim) {
    const unmarshalled = unmarshalClaimFeesTx(response);
    return {
      result: unmarshalled,
      transactionType: TransactionType.ClaimFees as const,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
  } else {
    const unmarshalled = unmarshalRenVMTransaction(response.tx);
    return {
      result: unmarshalled,
      transactionType: TransactionType.Mint as const,
      summary: await summarizeTransaction(unmarshalled, getChain),
    };
  }
};

export const queryMintOrBurn = async (
  provider: RenVMProvider,
  transactionHash: string,
  getChain: (chainName: string) => Chain | null
): Promise<SummarizedTransaction> => {
  let response: ResponseQueryTx;
  try {
    response = await provider.sendMessage(RPCMethod.QueryTx, {
      txHash: transactionHash,
    });
  } catch (error: any) {
    if (errorMatches(error, "not found")) {
      throw new TaggedError(error, RenVMTransactionError.TransactionNotFound);
    }
    throw error;
  }

  return unmarshalTransaction(response, getChain);
};

export const searchRenVMHash: SearchTactic<RenVMTransaction> = {
  match: (searchString: string) =>
    isURLBase64(searchString, {
      length: 32,
    }),

  search: async (
    searchString: string,
    updateStatus: (status: string) => void,
    getChain: (chainName: string) => Chain | null
  ): Promise<RenVMTransaction> => {
    updateStatus("Looking up RenVM hash...");

    const provider = new RenVMProvider(NETWORK);

    let queryTx = await queryMintOrBurn(provider, searchString, getChain);

    return RenVMTransaction(searchString, queryTx);
  },
};
