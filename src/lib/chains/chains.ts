// import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { Chain, ContractChain, RenNetwork } from "@renproject/utils";

import { evmChains } from "./chains/evmChains";
import {
    BitcoinCashDetails,
    BitcoinDetails,
    DigiByteDetails,
    DogecoinDetails,
    FilecoinDetails,
    LunaDetails,
    ZcashDetails,
} from "./chains/lockChains";
import { SolanaDetails } from "./chains/solana";

export const mintChains = [...Object.values(evmChains), SolanaDetails];

const lockChains = [
    BitcoinDetails,
    ZcashDetails,
    BitcoinCashDetails,
    DigiByteDetails,
    FilecoinDetails,
    LunaDetails,
    DogecoinDetails,
];

export const allChains = [...mintChains, ...lockChains];

export const ChainMapper = (
    chainName: string,
    network: RenNetwork,
): Chain | null => {
    for (const chain of mintChains) {
        if (chain.chainPattern.exec(chainName)) {
            return chain.usePublicProvider(network);
        }
    }

    for (const chain of lockChains) {
        if (chain.chainPattern.exec(chainName)) {
            return chain.usePublicProvider(network);
        }
    }

    console.error(`Couldn't find chain ${chainName}`);

    return null;
};

export const getContractChainParams = async (
    mintChain: ContractChain,
    to: string,
    payload: string,
    asset: string,
): Promise<ContractChain> => {
    for (const chainDetails of allChains) {
        if (chainDetails.chainPattern.exec(mintChain.chain)) {
            if (chainDetails && chainDetails.getOutputParams) {
                return chainDetails.getOutputParams(
                    mintChain,
                    to,
                    payload,
                    asset,
                );
            } else {
                throw new Error(
                    `Reconstructing mint parameters for ${mintChain.chain} is not supported yet.`,
                );
            }
        }
    }

    throw new Error(`Unable to get parameters for ${mintChain.chain}`);
};
