export const notImplemented = true;

// import { ApolloClient as ApolloClientInterface, gql } from "@apollo/react-hooks";
// import { RenNetwork } from "@renproject/utils";
// import ApolloClient from "apollo-boost";
// import { InMemoryCache } from "apollo-cache-inmemory";
// import fetch from "node-fetch";
// import { useMemo, useState } from "react";
// import { createContainer } from "unstated-next";

// import { NETWORK } from "../environmentVariables";
// import { SummarizedTransaction } from "../lib/searchResult";

// export const renVmTrackerUrl = (renNetwork: RenNetwork) => {
//     return renNetwork === "mainnet"
//         ? `https://stats.renproject.io/`
//         : `https://stats-testnet.renproject.io/`;
// };

// const HISTORIC_RESOLUTION = 50;

// export const getResolutionEndTimestamp = (
//     resolution = 80,
//     date = Date.now(),
// ) => {
//     // "round" timestamp to {resolution} seconds
//     const seconds = Math.floor(date / 1000);
//     const remainder = seconds % resolution;
//     return seconds - remainder;
// };

// const FRAGMENT_VOLUME_FIELDS = `
//             asset
//             chain
//             amount
//             amountInUsd
//             amountInBtc
//             amountInEth
// `;

// const VOLUMES_FRAGMENT = `
//     fragment VolumesSnapshot on Snapshot {
//         timestamp
//         volume {
//             ${FRAGMENT_VOLUME_FIELDS}
//         }
//         locked {
//             ${FRAGMENT_VOLUME_FIELDS}
//         }
//     }
// `;

// const getSnapshotSubQuery = (timestamp: string) => `
//     s${timestamp}: Snapshot(timestamp: "${timestamp}") {
//         ...VolumesSnapshot
//     }`;

// export const buildRenVmTrackerQuery = (network: RenNetwork) => {
//     const period24Hour = 24 * 60 * 60;
//     const interval = period24Hour / HISTORIC_RESOLUTION;

//     const endTimestamp = getResolutionEndTimestamp();

//     const subQueries = Array.from(new Array(HISTORIC_RESOLUTION)).map(
//         (_, i) => {
//             const timestamp = Math.ceil(endTimestamp - i * interval);
//             return getSnapshotSubQuery(timestamp.toString());
//         },
//     );

//     const snapshotQuery = `
//         ${VOLUMES_FRAGMENT}
//         query GetSnapshots {
//             assets: Snapshot(timestamp: "${endTimestamp}"){
//                 timestamp,
//                 prices {
//                     asset,
//                     decimals
//                 }
//             },
//             ${subQueries.reverse().join(",")}
//         }
//     `;
//     return gql(snapshotQuery);
// };

// export const apolloClientWithCache = (graphUrl: string) => {
//     const client = new ApolloClient<unknown>({
//         uri: graphUrl,
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         fetch: fetch as any,
//         cache: new InMemoryCache(),
//     });
//     client.defaultOptions.query = {
//         fetchPolicy: "cache-first",
//     };
//     return client as unknown as ApolloClientInterface<object>;
// };

// function useRenVMTrackerContainer() {
//     const renVmTracker = useMemo(
//         () => apolloClientWithCache(renVmTrackerUrl(NETWORK)),
//         [],
//     );

//     const [volume24Hour, setVolume24Hour] = useState<
//         SummarizedTransaction[] | undefined
//     >();

//     return {
//         volume24Hour,
//         // fetch24HourStats,
//     };
// }

// export const RenVMTrackerContainer = createContainer(useRenVMTrackerContainer);
