import {
    Arbitrum,
    Avalanche,
    BinanceSmartChain,
    Catalog,
    Ethereum,
    EthereumBaseChain,
    EVMNetworkConfig,
    Fantom,
    Goerli,
    Kava,
    Moonbeam,
    Optimism,
    Polygon,
} from "@renproject/chains";
import { AbiItem, EthArgs } from "@renproject/chains-ethereum//utils/abi";
import { resolveRpcEndpoints } from "@renproject/chains-ethereum//utils/generic";
import { EVMPayloadInterface } from "@renproject/chains-ethereum//utils/payloads/evmParams";
// import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
// import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { Chain, ChainCommon, RenNetwork, utils } from "@renproject/utils";
import Axios from "axios";
import { ethers } from "ethers";

import {
    ALCHEMY_KEY,
    INFURA_KEY,
    NETWORK,
} from "../../../environmentVariables";
import { TaggedError } from "../../taggedError";
import BasicAdapter from "../ABIs/BasicAdapter.json";
import BoundlessAdapter from "../ABIs/BoundlessAdapter.json";
import MEW from "../ABIs/MEW.json";
import { ChainDetails, ChainType } from "./types";

export const EthereumDetails: ChainDetails<Ethereum> = {
    chain: Ethereum.chain,
    chainPattern: /^(ethereum|eth|ren)$/i,
    assets: Ethereum.assets,
    type: ChainType.EVMChain,

    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.etherscan.io/api",
        [RenNetwork.Testnet]: "https://api-kovan.etherscan.io/api",
    },

    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Ethereum>(Ethereum, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Ethereum.configMap),
    //   {
    //     name: "WalletConnect",
    //     logo: Icons.WalletConnect,
    //     connector: new EthereumWalletConnectConnector({
    //       rpc: {
    //         1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    //         3: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    //         4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    //         42: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    //       },
    //       qrcode: true,
    //       debug: false,
    //       networkIdMapper: networkMapper(Ethereum.configMap),
    //     }),
    //   },
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(
            mintChain as EthereumBaseChain,
            to,
            payload,
            asset,
        ),
};

// BinanceSmartChain ///////////////////////////////////////////////////////////

export const BinanceSmartChainDetails: ChainDetails<BinanceSmartChain> = {
    chain: BinanceSmartChain.chain,
    chainPattern: /^(binancesmartchain|bsc)$/i,
    assets: BinanceSmartChain.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.bscscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.bscscan.com/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<BinanceSmartChain>(
            BinanceSmartChain,
            network,
        ),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(BinanceSmartChain.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(
            mintChain as BinanceSmartChain,
            to,
            payload,
            asset,
        ),
};

// Fantom ////////////////////////////////////////////////////////////////////

export const FantomDetails: ChainDetails<Fantom> = {
    chain: Fantom.chain,
    chainPattern: /^(fantom|ftm)$/i,
    assets: Fantom.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.ftmscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.ftmscan.com/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Fantom>(Fantom, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Fantom.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Fantom, to, payload, asset),
};

// Polygon ////////////////////////////////////////////////////////////////////

export const PolygonDetails: ChainDetails<Polygon> = {
    chain: Polygon.chain,
    chainPattern: /^(polygon|matic)$/i,
    assets: Polygon.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.polygonscan.com/api",
        [RenNetwork.Testnet]: "https://api-testnet.polygonscan.com/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Polygon>(Polygon, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Polygon.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Polygon, to, payload, asset),
};

// Avalanche ////////////////////////////////////////////////////////////////////

export const AvalancheDetails: ChainDetails<Avalanche> = {
    chain: Avalanche.chain,
    chainPattern: /^(avalanche|ava|avax)$/i,
    assets: Avalanche.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.snowtrace.io/api",
        [RenNetwork.Testnet]: "https://api-testnet.snowtrace.io/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Avalanche>(Avalanche, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Avalanche.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Avalanche, to, payload, asset),
};

// Goerli ////////////////////////////////////////////////////////////////////

export const GoerliDetails: ChainDetails<Goerli> = {
    chain: Goerli.chain,
    chainPattern: /^(goerli|goerlieth|geth)$/i,
    assets: Goerli.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Testnet]: "https://api-goerli.etherscan.io/api",
    },
    usePublicProvider: (network: RenNetwork) => {
        if (network === RenNetwork.Testnet) {
            return getPublicEthereumProvider<Goerli>(Goerli, network);
        } else {
            return null;
        }
    },

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Goerli.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Goerli, to, payload, asset),
};

// Arbitrum ////////////////////////////////////////////////////////////////////

export const ArbitrumDetails: ChainDetails<Arbitrum> = {
    chain: Arbitrum.chain,
    chainPattern: /^(arbitrum|arb|arbeth)$/i,
    assets: Arbitrum.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api.arbiscan.io/api",
        [RenNetwork.Testnet]: "https://api-testnet.arbiscan.io/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Arbitrum>(Arbitrum, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Arbitrum.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Arbitrum, to, payload, asset),
};

// Catalog ////////////////////////////////////////////////////////////////////

export const CatalogDetails: ChainDetails<Catalog> = {
    chain: Catalog.chain,
    chainPattern: /^(catalog|cat|renchain)$/i,
    assets: Catalog.assets,
    type: ChainType.EVMChain,
    etherscanApi: {},
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Catalog>(Catalog, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Catalog.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Catalog, to, payload, asset),
};

///////////////////////////////////////////////////////////////////////////////

export const OptimismDetails: ChainDetails<Optimism> = {
    chain: Optimism.chain,
    chainPattern: /^(optimism|arb|arbeth)$/i,
    assets: Optimism.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api-optimistic.etherscan.io/api",
        [RenNetwork.Testnet]: "https://api-kovan-optimistic.etherscan.io/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Optimism>(Optimism, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Optimism.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Optimism, to, payload, asset),
};

///////////////////////////////////////////////////////////////////////////////

export const MoonbeamDetails: ChainDetails<Moonbeam> = {
    chain: Moonbeam.chain,
    chainPattern: /^(moonbeam|glmr)$/i,
    assets: Moonbeam.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        [RenNetwork.Mainnet]: "https://api-moonbeam.moonscan.io/api",
        [RenNetwork.Testnet]: "https://api-moonbase.moonscan.io/api",
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Moonbeam>(Moonbeam, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Moonbeam.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Moonbeam, to, payload, asset),
};

///////////////////////////////////////////////////////////////////////////////

export const KavaDetails: ChainDetails<Kava> = {
    chain: Kava.chain,
    chainPattern: /^(kava)$/i,
    assets: Kava.assets,
    type: ChainType.EVMChain,
    etherscanApi: {
        // TODO
    },
    usePublicProvider: (network: RenNetwork) =>
        getPublicEthereumProvider<Kava>(Kava, network),

    // multiwalletConfig: (network: RenNetwork) => [
    //   injectedConnectorFactory(Kava.configMap),
    // ],

    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<EVMPayloadInterface> =>
        getEthereumMintParams(mintChain as Kava, to, payload, asset),
};

///////////////////////////////////////////////////////////////////////////////

export const evmChains = {
    // Place Goerli first so that it takes precedence over Ethereum for
    // Goerli assets.
    [GoerliDetails.chain]: GoerliDetails,

    [ArbitrumDetails.chain]: ArbitrumDetails,
    [AvalancheDetails.chain]: AvalancheDetails,
    [BinanceSmartChainDetails.chain]: BinanceSmartChainDetails,
    [CatalogDetails.chain]: CatalogDetails,
    [EthereumDetails.chain]: EthereumDetails,
    [FantomDetails.chain]: FantomDetails,
    [KavaDetails.chain]: KavaDetails,
    [MoonbeamDetails.chain]: MoonbeamDetails,
    [OptimismDetails.chain]: OptimismDetails,
    [PolygonDetails.chain]: PolygonDetails,
};

class StaticJsonRpcProvider extends ethers.providers.JsonRpcProvider {
    async getNetwork() {
        if (this._network) {
            return Promise.resolve(this._network);
        }
        return super.getNetwork();
    }
}

const getPublicEthereumProvider = <T extends EthereumBaseChain>(
    Class: {
        chain: string;
        new (...p: any[]): T;
        configMap: { [network: string]: EVMNetworkConfig };
    },
    network: RenNetwork,
): T => {
    const config = Class.configMap[network as any];
    if (!config) {
        throw new Error(
            `No network configuration for ${network} and ${Class.chain}.`,
        );
    }
    const urls = resolveRpcEndpoints(config.config.rpcUrls, {
        INFURA_API_KEY: INFURA_KEY,
        ALCHEMY_API_KEY: ALCHEMY_KEY,
    });

    const provider = new StaticJsonRpcProvider(
        urls[0],
        parseInt(config.config.chainId, 16),
    );
    return new Class({ provider, network }) as any as T;
};

const getEthereumMintParams = async (
    mintChain: EthereumBaseChain,
    to: string,
    payload: string,
    asset: string,
): Promise<EVMPayloadInterface> => {
    const payloadConfig: EVMPayloadInterface["payloadConfig"] = {
        preserveAddressFormat: true,
    };

    const code = await mintChain.provider.getCode(to);
    if (code === "0x") {
        return (mintChain as EthereumBaseChain).Account({
            account: to,
            payloadConfig,
        });
    }

    const abiFull = await getEvmABI(mintChain, to);
    if (!Array.isArray(abiFull)) {
        throw new Error(abiFull);
    }

    const abis = abiFull.filter(
        (abi) =>
            abi.inputs &&
            abi.inputs.length >= 3 &&
            (abi.inputs[abi.inputs?.length - 3].type === "uint256" ||
                abi.inputs[abi.inputs?.length - 3].type === "uint") &&
            abi.inputs[abi.inputs?.length - 2].type === "bytes32" &&
            abi.inputs[abi.inputs?.length - 1].type === "bytes",
    );

    let abi = abis[0];

    let valuesToDecode = abi.inputs;
    if (
        abis.length > 1 &&
        abis.filter((abi) => abi.name === "mintThenSwap").length
    ) {
        abi = abis.filter((abi) => abi.name === "mintThenSwap")[0];
        valuesToDecode = abi.inputs?.filter(
            (x) => x.name !== "_newMinExchangeRate",
        );
    }

    let parameters: EthArgs;

    // Varen override. TODO: Refactor to make overriding tidier.
    if (
        utils.Ox(to.toLowerCase()) ===
            "0xa9975b1c616b4841a1cc299bc6f684b4d1e23a61" ||
        utils.Ox(to.toLowerCase()) ===
            "0x82f2e6c57b7fde0ebb42f22bfc6b4a297e7d9be8" ||
        utils.Ox(to.toLowerCase()) ===
            "0xf0a8feacb869477954ab2f7f6ba0b35db235a2a9"
    ) {
        parameters = [
            {
                name: "sender",
                type: "address",
                value: utils.Ox(utils.fromHex(payload).slice(12)),
            },
            {
                name: "mintToken",
                type: "address",
                value: await (mintChain as EthereumBaseChain).getMintAsset(
                    asset,
                ),
                notInPayload: true,
            },
            {
                name: "burnToken",
                type: "address",
                value: utils.Ox("00".repeat(20)),
                notInPayload: true,
            },
            {
                name: "burnAmount",
                type: "uint256",
                value: 0,
                notInPayload: true,
            },
            {
                name: "burnSendTo",
                type: "bytes",
                value: Buffer.from([]),
                notInPayload: true,
            },
            {
                name: "swapVars",
                type: "tuple(address,uint256,address,bytes)",
                value: [
                    utils.Ox("00".repeat(20)),
                    0,
                    utils.Ox("00".repeat(20)),
                    Buffer.from([]),
                ],
                notInPayload: true,
            },
        ];
    } else {
        const abiValues = ethers.utils.defaultAbiCoder.decode(
            (valuesToDecode?.slice(0, -3) || []).map((x) => x.type),
            utils.fromHex(payload),
        );

        parameters = (valuesToDecode?.slice(0, -3) || []).map((abiItem, i) => ({
            name: abiItem.name,
            type: abiItem.type,
            value: abiValues[i],
        }));

        if (abi.name === "mintThenSwap") {
            parameters = [
                ...parameters.slice(0, 1),
                {
                    ...parameters[0],
                    notInPayload: true,
                    name: "_newMinExchangeRate",
                },
                ...parameters.slice(1),
                {
                    name: "_msgSender",
                    type: "address",
                    value: parameters[2].value,
                    onlyInPayload: true,
                },
            ];
        }
    }

    return (mintChain as EthereumBaseChain).Contract({
        to,
        method: abi.name || "",
        params: parameters,
        withRenParams: true,
        payloadConfig,
    });
};

const hardcodedABIs = (chain: ChainCommon, to: string): AbiItem[] | null => {
    if (
        to === "0xd087b0540e172553c12deeecdef3dfd21ec02066" ||
        to === "0xac23817f7e9ec7eb6b7889bdd2b50e04a44470c5"
    ) {
        return BasicAdapter as AbiItem[];
    }

    if (
        to === "0x0c6765a0cf9f18d8c6ca0685b8aa1394f6600f0c" ||
        to === "0x99a3b6a0dfecc25dc727eb3d6058b42485ff69b9"
    ) {
        return BoundlessAdapter as AbiItem[];
    }

    if (to === "0x10aa7bbcb29cf100fe0f25819d11499e43caaea5") {
        return MEW as AbiItem[];
    }

    // Catalog Adapter
    if (
        to === "0xa3deb3f1a03a505502c1b7d679521f93f1105542" ||
        to === "0x96081a4e7c3617a4d7dac9ac84d97255d63773d2"
    ) {
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
    if (
        evmChains[chain.chain] &&
        evmChains[chain.chain].etherscanApi?.[NETWORK]
    ) {
        const api = evmChains[chain.chain].etherscanApi![NETWORK];
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
