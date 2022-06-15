import {
    Arbitrum,
    Avalanche,
    Fantom,
    Goerli,
    Polygon,
} from "@renproject/chains";
import { BinanceSmartChain, Ethereum } from "@renproject/chains-ethereum";
import { AbiItem } from "@renproject/chains-ethereum/build/main/utils/abi";
import { ChainCommon, RenNetwork, utils } from "@renproject/utils";
import Axios from "axios";

import { NETWORK } from "../../environmentVariables";
import { TaggedError } from "../taggedError";
import BasicAdapter from "./ABIs/BasicAdapter.json";
import MEW from "./ABIs/MEW.json";

const hardcodedABIs = (chain: ChainCommon, to: string): AbiItem[] | null => {
    if (
        to === "0xd087b0540e172553c12deeecdef3dfd21ec02066" ||
        to === "0xac23817f7e9ec7eb6b7889bdd2b50e04a44470c5"
    ) {
        return BasicAdapter as AbiItem[];
    }

    if (to === "0x10aa7bbcb29cf100fe0f25819d11499e43caaea5") {
        return MEW as AbiItem[];
    }

    // Catalog Adapter
    if (to === "0xa3deb3f1a03a505502c1b7d679521f93f1105542") {
        return [
            {
                constant: false,
                inputs: [
                    {
                        internalType: "address",
                        name: "_token",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "_recipient",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "_amount",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes32",
                        name: "_nHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes",
                        name: "_sig",
                        type: "bytes",
                    },
                ],
                name: "mint",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
        ];
    }

    return null;
};

enum ABIError {
    ContractNotVerified = "Contract not verified.",
    ChainNotSupported = "Fetching ABI not supported on host-chain.",
}

type ABITactic = (chain: ChainCommon, to: string) => Promise<AbiItem[]>;

const etherscanAPIMap: {
    [chain: string]: { [network: string]: string };
} = {
    [Ethereum.chain]: {
        [RenNetwork.Mainnet]: "https://api.etherscan.io/api",
        [RenNetwork.Testnet]: "https://api-kovan.etherscan.io/api",
        [RenNetwork.Devnet]: "https://api-kovan.etherscan.io/api",
    },
    [BinanceSmartChain.chain]: {
        [RenNetwork.Mainnet]: "https://api.bscscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.bscscan.com/api",
        [RenNetwork.Devnet]: "https://api-testnet.bscscan.com/api",
    },
    [Fantom.chain]: {
        [RenNetwork.Mainnet]: "https://api.ftmscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.ftmscan.com/api",
        [RenNetwork.Devnet]: "https://api-testnet.ftmscan.com/api",
    },
    [Polygon.chain]: {
        [RenNetwork.Mainnet]: "https://api.polygonscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.polygonscan.com/api",
        [RenNetwork.Devnet]: "https://api-testnet.polygonscan.com/api",
    },
    [Arbitrum.chain]: {
        [RenNetwork.Mainnet]: "https://api.arbiscan.io/api",
        [RenNetwork.Testnet]: "https://api-testnet.arbiscan.io/api",
        [RenNetwork.Devnet]: "https://api-testnet.arbiscan.io/api",
    },
    [Avalanche.chain]: {
        [RenNetwork.Mainnet]: "https://api.snowtrace.io/api",
        [RenNetwork.Testnet]: "https://api-testnet.snowtrace.io/api",
        [RenNetwork.Devnet]: "https://api-testnet.snowtrace.io/api",
    },
    [Goerli.chain]: {
        [RenNetwork.Testnet]: "https://api-goerli.etherscan.io/api",
        [RenNetwork.Devnet]: "https://api-goerli.etherscan.io/api",
    },
};

const getProxy = (address: string): string => {
    if (address === "0xb6ea1d3fb9100a2cf166febe11f24367b5fcd24a") {
        return "0x1362e51c1aa40fd180824d4a7fc4f27e2bb3efe5";
    }
    return address;
};

const getABIFromEtherscan: ABITactic = async (
    chain: ChainCommon,
    to: string,
): Promise<AbiItem[]> => {
    if (etherscanAPIMap[chain.chain] && etherscanAPIMap[chain.chain][NETWORK]) {
        const api = etherscanAPIMap[chain.chain][NETWORK];
        const url = `${api}?module=contract&action=getabi&address=${getProxy(
            to,
        )}`;
        const response = await Axios.get<{
            status: "0" | "1";
            message: string;
            result: string;
        }>(url);
        const {
            data: { status, result },
        } = response;
        if (status === "0") {
            if (result === "Contract source code not verified") {
                throw new TaggedError(
                    `${chain.chain} contract source code not verified: ${to}`,
                    ABIError.ContractNotVerified,
                );
            }
            if (
                result ===
                "Max rate limit reached, please use API Key for higher rate limit"
            ) {
                throw new Error(
                    "Error fetching contract ABI - try again in 5 seconds.",
                );
            }
            throw new Error(result);
        } else {
            return JSON.parse(result);
        }
    }
    throw new TaggedError(
        `Fetching ABI not supported on ${chain.chain}.`,
        ABIError.ChainNotSupported,
    );
};

/**
 * getEvmABI takes an EVM-based chain and an address, and attempts to fetch
 * the ABI of the contract deployed at that address.
 *
 * It requires (1) the chain to have an Etherscan instance and (2) the contract
 * to be verified.
 *
 * @param chain An EVM-based chain
 * @param to A smart contract's address
 * @returns An AbiItem[], or ABIError if fetching the ABI is not possible.
 */
export const getEvmABI = async (
    chain: ChainCommon,
    to: Buffer | string,
): Promise<AbiItem[]> => {
    to = utils.Ox(to.toString()).toLowerCase();

    const hardcodedABI = hardcodedABIs(chain, to);
    if (hardcodedABI) {
        return hardcodedABI;
    }

    const tactics: ABITactic[] = [getABIFromEtherscan];

    for (const tactic of tactics) {
        try {
            return await tactic(chain, to);
        } catch (error: any) {
            if ((error as TaggedError)._tag === ABIError.ChainNotSupported) {
                continue;
            }
            throw error;
        }
    }

    throw new TaggedError(
        `Fetching ABI not supported on ${chain.chain}.`,
        ABIError.ChainNotSupported,
    );
};
