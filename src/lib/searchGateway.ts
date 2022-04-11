export const NULL = null;

// import BigNumber from "bignumber.js";

// import {
//     RenVMCrossChainTransaction,
//     RenVMProvider,
// } from "@renproject/provider";
// import RenJS from "@renproject/ren";
// import { GatewayParams } from "@renproject/ren/build/main/params";
// import {
//     ChainCommon,
//     ContractChain,
//     RenNetwork,
//     utils,
// } from "@renproject/utils";

// import { NETWORK } from "../environmentVariables";
// import { getContractChainParams } from "./chains/chains";
// import { RenVMGateway, TransactionSummary } from "./searchResult";
// import { queryGateway } from "./searchTactics/searchGateway";

// export const searchGateway = async (
//   gateway: RenVMGateway,
//   getChain: (chainName: string) => Chain | null
// ): Promise<RenVMGateway | null> => {
//   const provider = new RenVMProvider(NETWORK);

//   if (!gateway.queryGateway) {
//     gateway.queryGateway = await queryGateway(
//       provider,
//       gateway.address,
//       getChain
//     );
//   }

//   return gateway;
// };

// export const getGatewayInstance = async (
//   searchDetails: RenVMCrossChainTransaction,
//   _network: RenNetwork,
//   summary: TransactionSummary
// ) => {
//   const inputs = searchDetails.in as unknown as {
//     amount: BigNumber;
//     ghash: string;
//     gpubkey: string;
//     nhash: string;
//     nonce: string;
//     payload: string;
//     phash: string;
//     to: string;
//     txid: string;
//     txindex: string;
//   };

//   if (!summary.fromChain) {
//     throw new Error(
//       `Fetching transaction details not supported yet for ${summary.from}.`
//     );
//   }

//   if (!summary.toChain) {
//     throw new Error(
//       `Fetching transaction details not supported yet for ${summary.to}.`
//     );
//   }

//   const params: GatewayParams = {
//     asset: summary.asset,
//     from: summary.fromChain as LockChain,
//     to: await getContractChainParams(
//       summary.toChain as ContractChain,
//       inputs.to,
//       inputs.payload,
//       summary.asset
//     ),
//     nonce: utils.Ox(inputs.nonce),
//     shard: {
//       gPubKey: utils.toBase64(searchDetails.in.gpubkey),
//     },
//   };

//   const provider = new RenVMProvider(NETWORK);
//   const lockAndMint = await new RenJS(provider as any).gateway(params as any, {
//     transactionVersion: searchDetails.version,
//     gPubKey: (searchDetails.in as any).gpubkey,
//     loadCompletedDeposits: true,
//   });

//   return lockAndMint;
// };
