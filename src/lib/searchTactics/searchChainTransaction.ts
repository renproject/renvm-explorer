import {
  RenVMProvider,
  RPCMethod,
  RPCResponses,
  unmarshalRenVMTransaction,
} from "@renproject/provider";
import { Chain, ChainCommon, utils } from "@renproject/utils";

import { NETWORK } from "../../environmentVariables";
import { allChains } from "../chains/chains";
import {
  RenVMTransaction,
  SummarizedTransaction,
  TransactionType,
} from "../searchResult";
import { summarizeTransaction } from "./searchRenVMHash";
import { SearchTactic } from "./searchTactic";

export const queryTxsByTxid = async (
  provider: RenVMProvider,
  txid: Buffer,
  getChain: (chainName: string) => Chain | null
): Promise<Array<SummarizedTransaction>> => {
  const response: { txs: Array<RPCResponses[RPCMethod.QueryTx]["tx"]> } =
    await provider.sendMessage(
      "ren_queryTxsByTxid" as any,
      { txid: utils.toURLBase64(txid) },
      1
    );

  if (response.txs.length === 0) {
    throw new Error(`Transaction not found.`);
  }

  return await Promise.all(
    response.txs.map(async (tx) => {
      const isMint = /((\/to)|(To))/.exec(tx.selector);

      // Unmarshal transaction.
      if (isMint) {
        const unmarshalled = unmarshalRenVMTransaction(tx);
        return {
          result: unmarshalled,
          transactionType: TransactionType.Mint as const,
          summary: await summarizeTransaction(unmarshalled, getChain),
        };
      } else {
        const unmarshalled = unmarshalRenVMTransaction(tx);
        return {
          result: unmarshalled,
          transactionType: TransactionType.Burn as const,
          summary: await summarizeTransaction(unmarshalled, getChain),
        };
      }
    })
  );
};

const OR = (left: boolean, right: boolean) => left || right;

export const searchChainTransaction: SearchTactic<RenVMTransaction> = {
  match: (
    searchString: string,
    getChain: (chainName: string) => Chain | null
  ) =>
    allChains
      .map((chain) => getChain(chain.chain))
      .map((chain) =>
        utils.doesntError(() =>
          chain
            ? chain.validateTransaction({ txidFormatted: searchString })
            : false
        )()
      )
      .reduce(OR, false),
  search: async (
    searchString: string,
    updateStatus: (status: string) => void,
    getChain: (chainName: string) => Chain | null
  ): Promise<RenVMTransaction[]> => {
    const formats = Array.from(
      // Remove duplicates.
      new Set(
        allChains
          .map((chain) => getChain(chain.chain))
          .map((chain) =>
            chain && chain.validateTransaction({ txidFormatted: searchString })
              ? chain.txidFormattedToTxid(searchString)
              : null
          )
          .filter((txid) => txid !== null)
      )
    ).map((x) => (x !== null ? Buffer.from(x, "base64") : null));

    if (formats.length) {
      updateStatus(
        `Looking up ${formats.length} chain transaction format${
          formats.length === 1 ? "" : "s"
        }...`
      );
    } else {
      return [];
    }

    const provider = new RenVMProvider(NETWORK);

    let queryTxs;
    for (const format of formats) {
      try {
        queryTxs = await queryTxsByTxid(provider, format!, getChain);
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
