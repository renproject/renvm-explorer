import {
  ChainCommon,
  EthArgs,
  LockAndMintParams,
  LockAndMintTransaction,
  LockChain,
  MintChain,
  RenNetwork,
} from "@renproject/interfaces";
import RenJS from "@renproject/ren";
import { LockAndMintDeposit } from "@renproject/ren/build/main/lockAndMint";
import { Ox, parseV1Selector } from "@renproject/utils";
import BigNumber from "bignumber.js";
import { AbiCoder } from "web3-eth-abi";
import { RenVMTransaction, TransactionSummary } from "./searchResult";
import { queryMintOrBurn } from "./searchTactics/searchRenVMHash";
import { RenVMProvider } from "@renproject/rpc/build/main/v2";
import { NETWORK } from "../environmentVariables";
import { getEvmABI } from "./getABI";

export const searchTransaction = async (
  transaction: RenVMTransaction,
  getChain: (chainName: string) => ChainCommon | null
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
  searchDetails: LockAndMintTransaction,
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

  if (summary.fromChain && summary.toChain) {
    const abiFull = await getEvmABI(summary.toChain, inputs.to);
    if (!Array.isArray(abiFull)) {
      throw new Error(abiFull);
    }

    const abi = abiFull.filter(
      (abi) =>
        abi.inputs &&
        abi.inputs.length >= 3 &&
        (abi.inputs[abi.inputs?.length - 3].type === "uint256" ||
          abi.inputs[abi.inputs?.length - 3].type === "uint") &&
        abi.inputs[abi.inputs?.length - 2].type === "bytes32" &&
        abi.inputs[abi.inputs?.length - 1].type === "bytes"
    )[0];

    const abiValues = new AbiCoder().decodeParameters(
      (abi.inputs?.slice(0, -3) || []).map((x) => x.type),
      inputs.payload
    );

    const parameters: EthArgs = (abi.inputs?.slice(0, -3) || []).map(
      (abiItem, i) => ({
        name: abiItem.name,
        type: abiItem.type,
        value: abiValues[i],
      })
    );

    const params: LockAndMintParams = {
      asset: summary.asset,
      from: summary.fromChain as LockChain,
      to: summary.toChain as MintChain,

      contractCalls: [
        {
          sendTo: Ox(inputs.to.toString()),
          contractFn: abi.name || "",
          contractParams: parameters,
        },
      ],
      nonce: Ox(inputs.nonce),
    };

    const provider = new RenVMProvider(NETWORK);
    const lockAndMint = await new RenJS(provider).lockAndMint(params, {
      transactionVersion: searchDetails.version,
      gPubKey: (searchDetails.in as any).gpubkey,
    });

    const deposit = await lockAndMint.processDeposit({
      transaction: await summary.fromChain.transactionFromRPCFormat(
        inputs.txid,
        inputs.txindex.toString(),
        true
      ),
      amount: inputs.amount.toFixed(),
    });
    (deposit as any).gatewayAddress = lockAndMint.gatewayAddress;

    return deposit;
  }

  return null;
};

export const continueMint = async (deposit: LockAndMintDeposit) => {
  return await deposit.mint();
};
