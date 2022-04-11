import BigNumber from "bignumber.js";

import {
  RenVMCrossChainTransaction,
  RenVMProvider,
} from "@renproject/provider";
import RenJS from "@renproject/ren";
import { TransactionParams } from "@renproject/ren/build/main/params";
import {
  Chain,
  ChainCommon,
  ContractChain,
  RenNetwork,
  utils,
} from "@renproject/utils";

import { NETWORK } from "../environmentVariables";
import { getContractChainParams } from "./chains/chains";
import { RenVMTransaction, TransactionSummary } from "./searchResult";
import { queryMintOrBurn } from "./searchTactics/searchRenVMHash";

export const searchTransaction = async (
  transaction: RenVMTransaction,
  getChain: (chainName: string) => Chain | null
): Promise<RenVMTransaction | null> => {
  const provider = new RenVMProvider(NETWORK);

  if (!transaction.queryTx) {
    transaction.queryTx = await queryMintOrBurn(
      provider,
      transaction.txHash,
      getChain
    );
  }

  return transaction;
};

export const getTransactionDepositInstance = async (
  searchDetails: RenVMCrossChainTransaction,
  network: RenNetwork,
  summary: TransactionSummary
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
      `Fetching transaction details not supported yet for ${summary.from}.`
    );
  }

  if (!summary.toChain) {
    throw new Error(
      `Fetching transaction details not supported yet for ${summary.to}.`
    );
  }

  const txParams: TransactionParams = {
    asset: summary.asset,
    fromTx: {
      asset: summary.asset,
      chain: summary.from,
      txid: utils.toURLBase64(searchDetails.in.txid),
      txidFormatted: utils.toURLBase64(searchDetails.in.txid),
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
      Buffer.isBuffer(inputs.payload)
        ? inputs.payload.toString("hex")
        : inputs.payload,
      summary.asset
    ),
  };

  const provider = new RenVMProvider(network);
  const deposit = await new RenJS(provider as any).gatewayTransaction(txParams);

  if (deposit.hash !== searchDetails.hash) {
    console.error(`Expected ${deposit.hash} to equal ${searchDetails.hash}.`);
    await deposit.renVM.submit();
  }

  return {
    deposit,
  };
};
