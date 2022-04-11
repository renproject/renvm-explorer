export const NULL = null;

// import { ethers } from "ethers";

// import { EthereumClass } from "@renproject/chains";
// import RenJS from "@renproject/ren";
// import { RenVMProvider } from "@renproject/rpc/build/main/v1";
// import {
//     ChainCommon,
//     ContractChain,
//     EthArgs,
//     LockAndMintParams,
//     LockAndMintTransaction,
//     LockChain,
//     Ox,
//     RenNetwork,
// } from "@renproject/utils";

// import { NETWORK } from "../environmentVariables";
// import { getEvmABI } from "./chains/getABI";
// import { LegacyRenVMTransaction, TransactionSummary } from "./searchResult";
// import { queryMintOrBurn } from "./searchTactics/searchLegacyRenVMTransaction";

// export const searchLegacyTransaction = async (
//   transaction: LegacyRenVMTransaction,
//   getChain: (chainName: string) => Chain | null
// ): Promise<LegacyRenVMTransaction | null> => {
//   const provider = new RenVMProvider(NETWORK);

//   if (!transaction.queryTx) {
//     transaction.queryTx = await queryMintOrBurn(
//       provider,
//       transaction.txHash,
//       getChain
//     );
//   }

//   return transaction;
// };

// export const getLegacyTransactionDepositInstance = async (
//   searchDetails: LockAndMintTransaction,
//   network: RenNetwork,
//   summary: TransactionSummary
// ) => {
//   // const abi = (searchDetails.in.p.abi[0].inputs || []).slice(0, -3);

//   // const abiCoder = new AbiCoder();
//   // const abiValues = abiCoder.decodeParameters(
//   //   abi.map((x) => x.type),
//   //   "0x" + searchDetails.in.p.value.toString("hex")
//   // );

//   // const parameters: EthArgs = abi.map((abiItem, i) => ({
//   //   name: abiItem.name,
//   //   type: abiItem.type,
//   //   value: abiValues[i],
//   // }));

//   const inputs = searchDetails.in;

//   if (summary.fromChain && summary.toChain) {
//     let functionName: string;
//     let parameters: EthArgs;

//     if (searchDetails.in.p.abi[0] && searchDetails.in.p.abi[0].inputs) {
//       const abi = (searchDetails.in.p.abi[0].inputs || []).slice(0, -3);

//       const abiValues = ethers.utils.defaultAbiCoder.decode(
//         abi.map((x) => x.type),
//         "0x" + searchDetails.in.p.value.toString("hex")
//       );

//       parameters = abi.map((abiItem, i) => ({
//         name: abiItem.name,
//         type: abiItem.type,
//         value: abiValues[i],
//       }));

//       functionName = searchDetails.in.p.fn;
//     } else {
//       const abiFull = await getEvmABI(summary.toChain, inputs.to);
//       if (!Array.isArray(abiFull)) {
//         throw new Error(abiFull);
//       }

//       const abis = abiFull.filter(
//         (abi) =>
//           abi.inputs &&
//           abi.inputs.length >= 3 &&
//           (abi.inputs[abi.inputs?.length - 3].type === "uint256" ||
//             abi.inputs[abi.inputs?.length - 3].type === "uint") &&
//           abi.inputs[abi.inputs?.length - 2].type === "bytes32" &&
//           abi.inputs[abi.inputs?.length - 1].type === "bytes"
//       );

//       let abi = abis[0];
//       if (
//         abis.length > 1 &&
//         abis.filter((abi) => abi.name === "mintThenSwap").length
//       ) {
//         abi = abis.filter((abi) => abi.name === "mintThenSwap")[0];
//       }

//       // Varen override. TODO: Refactor to make overriding tidier.
//       if (
//         Ox(inputs.to.toLowerCase()) ===
//         "0xa9975b1c616b4841a1cc299bc6f684b4d1e23a61"
//       ) {
//         parameters = [
//           {
//             name: "sender",
//             type: "address",
//             value: Ox(searchDetails.in.p.value.slice(12)),
//           },
//           {
//             name: "mintToken",
//             type: "address",
//             value: await (
//               summary.toChain as EthereumClass
//             ).getTokenContractAddress(summary.asset),
//             notInPayload: true,
//           },
//           {
//             name: "burnToken",
//             type: "address",
//             value: Ox("00".repeat(20)),
//             notInPayload: true,
//           },
//           { name: "burnAmount", type: "uint256", value: 0, notInPayload: true },
//           {
//             name: "burnSendTo",
//             type: "bytes",
//             value: Buffer.from([]),
//             notInPayload: true,
//           },
//           {
//             name: "swapVars",
//             type: "tuple(address,uint256,address,bytes)",
//             value: [
//               Ox("00".repeat(20)),
//               0,
//               Ox("00".repeat(20)),
//               Buffer.from([]),
//             ],
//             notInPayload: true,
//           },
//         ];
//       } else {
//         const abiValues = ethers.utils.defaultAbiCoder.decode(
//           (abi.inputs?.slice(0, -3) || []).map((x) => x.type),
//           Ox(inputs.p.value)
//         );

//         parameters = (abi.inputs?.slice(0, -3) || []).map((abiItem, i) => ({
//           name: abiItem.name,
//           type: abiItem.type,
//           value: abiValues[i],
//         }));
//       }

//       functionName = abi.name || "";
//     }

//     if (summary.fromChain && summary.toChain) {
//       const params: LockAndMintParams = {
//         asset: summary.asset,
//         from: summary.fromChain as LockChain,
//         to: summary.toChain as ContractChain,

//         contractCalls: [
//           {
//             sendTo: searchDetails.in.to,
//             contractFn: functionName,
//             contractParams: parameters,
//           },
//         ],
//         nonce: searchDetails.in.n,
//       };

//       const lockAndMint = await new RenJS(network as any).lockAndMint(
//         params as any,
//         {
//           loadCompletedDeposits: true,
//         }
//       );

//       const tx = await summary.fromChain.transactionFromRPCFormat(
//         Buffer.from(searchDetails.in.utxo.txHash, "hex"),
//         searchDetails.in.utxo.vOut.toString(),
//         false
//       );

//       const deposit = await lockAndMint.processDeposit({
//         transaction: tx,
//         amount: searchDetails.in.utxo.amount,
//       });

//       const depositHash = deposit.txHash();
//       if (depositHash !== searchDetails.hash) {
//         console.error(
//           `Expected ${depositHash} to equal ${searchDetails.hash}.`
//         );
//         await deposit.signed();
//       }

//       return {
//         lockAndMint,
//         deposit,
//       };
//     }
//   }

//   return { lockAndMint: null, deposit: null };
// };
