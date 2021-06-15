import { isHex } from "./common";
import { SearchTactic } from "./searchTactic";
import {
  LockAndMintTransaction,
  BurnAndReleaseTransaction,
  ChainCommon,
  TxStatus,
} from "@renproject/interfaces";
import {
  RenVMProvider,
  unmarshalMintTx,
  unmarshalBurnTx,
  RenVMResponses,
  RPCMethod,
} from "@renproject/rpc/build/main/v2";
import { NETWORK } from "../../environmentVariables";
import { RenVMTransaction, TransactionSummary } from "../searchResult";
import { toURLBase64 } from "@renproject/utils";
import { summarizeTransaction } from "./searchRenVMHash";

export const queryTxsByTxid = async (
  provider: RenVMProvider,
  txid: string,
  getChain: (chainName: string) => ChainCommon | null
): Promise<
  Array<
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
  >
> => {
  const response: { txs: Array<RenVMResponses[RPCMethod.QueryTx]["tx"]> } =
    await provider.sendMessage(
      "ren_queryTxByTxid" as any,
      { txid: toURLBase64(Buffer.from(txid, "hex").reverse()) },
      1
    );

  if (response.txs.length === 0) {
    throw new Error(`Transaction not found.`);
  }

  return await Promise.all(
    response.txs.map(async (tx) => {
      const response = {
        tx,
        txStatus: TxStatus.TxStatusNil,
      };

      const isMint = /((\/to)|(To))/.exec(response.tx.selector);

      // Unmarshal transaction.
      if (isMint) {
        const unmarshalled = unmarshalMintTx(response);
        return {
          result: unmarshalled,
          isMint: true as const,
          summary: await summarizeTransaction(unmarshalled, getChain),
        };
      } else {
        const unmarshalled = unmarshalBurnTx(response);
        return {
          result: unmarshalled,
          isMint: false as const,
          summary: await summarizeTransaction(unmarshalled, getChain),
        };
      }
    })
  );
};

export const searchLockTransaction: SearchTactic<RenVMTransaction> = {
  match: (searchString: string) =>
    isHex(searchString, {
      length: 32,
    }),

  search: async (
    searchString: string,
    updateStatus: (status: string) => void,
    getChain: (chainName: string) => ChainCommon | null
  ): Promise<RenVMTransaction[]> => {
    updateStatus("Looking up RenVM hash...");

    const provider = new RenVMProvider(NETWORK);

    let queryTxs = await queryTxsByTxid(provider, searchString, getChain);

    return queryTxs.map((queryTx) => RenVMTransaction(queryTx.result.hash));
  },
};
