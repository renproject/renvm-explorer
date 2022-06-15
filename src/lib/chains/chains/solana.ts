import { Solana } from "@renproject/chains";
import { resolveNetwork } from "@renproject/chains-solana/build/main/networks";
// import { SolanaConnector } from "@renproject/multiwallet-solana-connector";
import { Chain, ContractChain, RenNetwork } from "@renproject/utils";

import { ChainDetails, ChainType } from "./types";

export const SolanaDetails: ChainDetails<Solana> = {
    chain: Solana.chain,
    chainPattern: /^(Solana|eth)$/i,
    assets: Solana.assets,
    type: ChainType.SolanaChain,
    usePublicProvider: (network: RenNetwork) =>
        getPublicSolanaProvider<Solana>(Solana, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   ...((window as any).solana
    //     ? [
    //         {
    //           name: "Phantom",
    //           logo: Icons.Phantom,
    //           connector: new SolanaConnector({
    //             debug: true,
    //             providerURL: (window as any).solana,
    //             network,
    //           }),
    //         },
    //       ]
    //     : []),
    //   {
    //     name: "Sollet",
    //     logo: Icons.Sollet,
    //     connector: new SolanaConnector({
    //       debug: true,
    //       providerURL: "https://www.sollet.io",
    //       network,
    //     }),
    //   },
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        // const decoded =
        //     payload.length > 0
        //         ? new AbiCoder().decode(
        //               ["string"],
        //               Buffer.from(payload, "hex"),
        //           )[0]
        //         : undefined;

        return (mintChain as Solana).TokenAddress(to);
    },

    getTokenAccount: async (
        mintChain: ContractChain,
        asset: string,
    ): Promise<string | null> => {
        throw new Error("Not implemented");
        // const mintParameters = await (mintChain as Solana).getOutputParams(asset);
        // const address = mintParameters?.contractCalls?.[0].sendTo;
        // const tokenAccount = await (mintChain as Solana).getAssociatedTokenAccount(
        //   asset,
        //   address
        // );
        // return tokenAccount?.toString();
    },

    createTokenAccount: async (
        mintChain: ContractChain,
        asset: string,
    ): Promise<string> => {
        throw new Error("Not implemented");
        // const mintParameters = await (mintChain as Solana).getOutputPayload(asset);
        // const address = mintParameters?.contractCalls?.[0].sendTo;
        // const tokenAccount = await (
        //   mintChain as Solana
        // ).createAssociatedTokenAccount(asset, address);
        // return tokenAccount?.toString();
    },
};

const getPublicSolanaProvider = <T extends Solana>(
    Class: typeof Solana,
    network: RenNetwork,
): T => {
    const config = resolveNetwork(network);
    if (!config) {
        throw new Error(
            `No network configuration for ${network} and ${Class.chain}.`,
        );
    }

    const c = new Class({
        network,
    }) as any as T;
    return c;
};
