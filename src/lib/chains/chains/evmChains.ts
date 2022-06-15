import {
    Arbitrum,
    Avalanche,
    BinanceSmartChain,
    Catalog,
    Ethereum,
    EVMNetworkConfig,
    Fantom,
    Goerli,
    Polygon,
} from "@renproject/chains";
import { EthArgs } from "@renproject/chains-ethereum/build/main/utils/abi";
import { resolveRpcEndpoints } from "@renproject/chains-ethereum/build/main/utils/generic";
import {
    EVMPayload,
    EVMPayloadInterface,
} from "@renproject/chains-ethereum/build/main/utils/payloads/evmPayloadHandlers";
// import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
// import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { Chain, RenNetwork, utils } from "@renproject/utils";
import { ethers } from "ethers";

import { ALCHEMY_KEY, INFURA_KEY } from "../../../environmentVariables";
import { getEvmABI } from "../getABI";
import { ChainDetails, ChainType } from "./types";

type EthereumClass =
    | Arbitrum
    | Avalanche
    | Catalog
    | BinanceSmartChain
    | Ethereum
    | Fantom
    | Goerli
    | Polygon;

export const EthereumDetails: ChainDetails<Ethereum> = {
    chain: Ethereum.chain,
    chainPattern: /^(ethereum|eth|ren)$/i,
    assets: Ethereum.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as EthereumClass, to, payload, asset),
};

// BinanceSmartChain ///////////////////////////////////////////////////////////

export const BinanceSmartChainDetails: ChainDetails<BinanceSmartChain> = {
    chain: BinanceSmartChain.chain,
    chainPattern: /^(binancesmartchain|bsc)$/i,
    assets: BinanceSmartChain.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Fantom, to, payload, asset),
};

// Polygon ////////////////////////////////////////////////////////////////////

export const PolygonDetails: ChainDetails<Polygon> = {
    chain: Polygon.chain,
    chainPattern: /^(polygon|matic)$/i,
    assets: Polygon.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Polygon, to, payload, asset),
};

// Avalanche ////////////////////////////////////////////////////////////////////

export const AvalancheDetails: ChainDetails<Avalanche> = {
    chain: Avalanche.chain,
    chainPattern: /^(avalanche|ava|avax)$/i,
    assets: Avalanche.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Avalanche, to, payload, asset),
};

// Goerli ////////////////////////////////////////////////////////////////////

export const GoerliDetails: ChainDetails<Goerli> = {
    chain: Goerli.chain,
    chainPattern: /^(goerli|goerlieth|geth)$/i,
    assets: Goerli.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Goerli, to, payload, asset),
};

// Arbitrum ////////////////////////////////////////////////////////////////////

export const ArbitrumDetails: ChainDetails<Arbitrum> = {
    chain: Arbitrum.chain,
    chainPattern: /^(arbitrum|arb|arbeth)$/i,
    assets: Arbitrum.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Arbitrum, to, payload, asset),
};

// Catalog ////////////////////////////////////////////////////////////////////

export const CatalogDetails: ChainDetails<Catalog> = {
    chain: Catalog.chain,
    chainPattern: /^(catalog|cat|renchain)$/i,
    assets: Catalog.assets,
    type: ChainType.EVMChain,
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
    ): Promise<EVMPayload> =>
        getEthereumMintParams(mintChain as Catalog, to, payload, asset),
};

///////////////////////////////////////////////////////////////////////////////

class StaticJsonRpcProvider extends ethers.providers.JsonRpcProvider {
    async getNetwork() {
        if (this._network) {
            return Promise.resolve(this._network);
        }
        return super.getNetwork();
    }
}

const getPublicEthereumProvider = <
    T extends
        | Arbitrum
        | Avalanche
        | Catalog
        | BinanceSmartChain
        | Ethereum
        | Fantom
        | Goerli
        | Polygon,
>(
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
    mintChain: EthereumClass,
    to: string,
    payload: string,
    asset: string,
): Promise<EVMPayload> => {
    const payloadConfig: EVMPayloadInterface["payloadConfig"] = {
        preserveAddressFormat: true,
    };

    const code = await mintChain.provider.getCode(to);
    if (code === "0x") {
        return (mintChain as EthereumClass).Account({
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
                value: await (mintChain as EthereumClass).getMintAsset(asset),
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

    return (mintChain as EthereumClass).Contract({
        to,
        method: abi.name || "",
        params: parameters,
        withRenParams: true,
        payloadConfig,
    });
};
