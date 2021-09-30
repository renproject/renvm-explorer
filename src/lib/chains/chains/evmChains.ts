import { ethers } from "ethers";

import {
    Arbitrum,
    Avalanche,
    BinanceSmartChain,
    Ethereum,
    EthereumClass,
    EthereumConfig,
    Fantom,
    Goerli,
    Polygon,
} from "@renproject/chains";
import { EthArgs, MintChain, RenNetwork } from "@renproject/interfaces";
import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { fromHex, Ox } from "@renproject/utils";

import { INFURA_KEY } from "../../../environmentVariables";
import { getEvmABI } from "../getABI";
import { Icons } from "../icons/wallets";
import { ChainDetails } from "./types";

export const networkMapper =
  (map: {
    [RenNetwork.Mainnet]?: { networkID: number };
    [RenNetwork.Testnet]?: { networkID: number };
    [RenNetwork.Devnet]?: { networkID: number };
  }) =>
  (id: string | number): RenNetwork => {
    const devnet = map[RenNetwork.Devnet];
    return {
      [map[RenNetwork.Mainnet]!.networkID]: RenNetwork.Mainnet,
      [map[RenNetwork.Testnet]!.networkID]: RenNetwork.Testnet,
      [devnet ? devnet.networkID : -1]: RenNetwork.Devnet,
    }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
  };

export const injectedConnectorFactory = (
  map: {
    [network in RenNetwork]?: EthereumConfig;
  }
) => {
  return {
    name: "Metamask",
    logo: Icons.Metamask,
    connector: new EthereumInjectedConnector({
      debug: true,
      networkIdMapper: networkMapper(map),
    }),
  };
};

export const EthereumDetails: ChainDetails<Ethereum> = {
  chain: Ethereum.chain,
  chainPattern: /^(ethereum|eth)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Ethereum>(Ethereum, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Ethereum.configMap),
    {
      name: "WalletConnect",
      logo: Icons.WalletConnect,
      connector: new EthereumWalletConnectConnector({
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
          3: `https://kovan.infura.io/v3/${INFURA_KEY}`,
          4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
          42: `https://kovan.infura.io/v3/${INFURA_KEY}`,
        },
        qrcode: true,
        debug: false,
        networkIdMapper: networkMapper(Ethereum.configMap),
      }),
    },
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as EthereumClass, to, payload),
};

// BinanceSmartChain ///////////////////////////////////////////////////////////

export const BinanceSmartChainDetails: ChainDetails<BinanceSmartChain> = {
  chain: BinanceSmartChain.chain,
  chainPattern: /^(binancesmartchain|bsc)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<BinanceSmartChain>(BinanceSmartChain, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(BinanceSmartChain.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as BinanceSmartChain, to, payload),
};

// Fantom ////////////////////////////////////////////////////////////////////

export const FantomDetails: ChainDetails<Fantom> = {
  chain: Fantom.chain,
  chainPattern: /^(fantom|ftm)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Fantom>(Fantom, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Fantom.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as Fantom, to, payload),
};

// Polygon ////////////////////////////////////////////////////////////////////

export const PolygonDetails: ChainDetails<Polygon> = {
  chain: Polygon.chain,
  chainPattern: /^(polygon|matic)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Polygon>(Polygon, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Polygon.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as Polygon, to, payload),
};

// Avalanche ////////////////////////////////////////////////////////////////////

export const AvalancheDetails: ChainDetails<Avalanche> = {
  chain: Avalanche.chain,
  chainPattern: /^(avalanche|ava|avax)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Avalanche>(Avalanche, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Avalanche.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as Avalanche, to, payload),
};

// Goerli ////////////////////////////////////////////////////////////////////

export const GoerliDetails: ChainDetails<Goerli> = {
  chain: Goerli.chain,
  chainPattern: /^(goerli|goerlieth|geth)$/i,
  usePublicProvider: (network: RenNetwork) => {
    if (network === RenNetwork.Testnet) {
      return getPublicEthereumProvider<Goerli>(Goerli, network);
    } else {
      return null;
    }
  },

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Goerli.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as Goerli, to, payload),
};

// Arbitrum ////////////////////////////////////////////////////////////////////

export const ArbitrumDetails: ChainDetails<Arbitrum> = {
  chain: Arbitrum.chain,
  chainPattern: /^(arbitrum|arb|arbeth)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Arbitrum>(Arbitrum, network),

  multiwalletConfig: (network: RenNetwork) => [
    injectedConnectorFactory(Arbitrum.configMap),
  ],

  nativeAssets: [],

  getMintParams: async (
    mintChain: MintChain,
    to: string,
    payload: string
  ): Promise<MintChain> =>
    getEthereumMintParams(mintChain as Arbitrum, to, payload),
};

///////////////////////////////////////////////////////////////////////////////

export const getPublicEthereumProvider = <
  T extends
    | Arbitrum
    | Avalanche
    | BinanceSmartChain
    | Ethereum
    | EthereumClass
    | Fantom
    | Goerli
    | Polygon
>(
  Class: {
    chain: string;
    new (...p: any[]): T;
    configMap: { [network: string]: EthereumConfig };
  },
  network: RenNetwork
): T => {
  const config = Class.configMap[network as any];
  if (!config) {
    throw new Error(
      `No network configuration for ${network} and ${Class.chain}.`
    );
  }
  const provider = new ethers.providers.JsonRpcProvider(
    config?.publicProvider({ infura: INFURA_KEY })
  );
  const signer = provider.getSigner();
  return new Class({ provider, signer }, network) as any as T;
};

export const getEthereumMintParams = async (
  mintChain: EthereumClass,
  to: string,
  payload: string
) => {
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
      abi.inputs[abi.inputs?.length - 1].type === "bytes"
  );

  let abi = abis[0];
  let valuesToDecode = abi.inputs;
  if (
    abis.length > 1 &&
    abis.filter((abi) => abi.name === "mintThenSwap").length
  ) {
    abi = abis.filter((abi) => abi.name === "mintThenSwap")[0];
    valuesToDecode = abi.inputs?.filter(
      (x) => x.name !== "_newMinExchangeRate"
    );
  }

  const abiValues = ethers.utils.defaultAbiCoder.decode(
    (valuesToDecode?.slice(0, -3) || []).map((x) => x.type),
    fromHex(payload)
  );

  let parameters: EthArgs = (valuesToDecode?.slice(0, -3) || []).map(
    (abiItem, i) => ({
      name: abiItem.name,
      type: abiItem.type,
      value: abiValues[i],
    })
  );

  if (abi.name === "mintThenSwap") {
    parameters = [
      ...parameters.slice(0, 1),
      { ...parameters[0], notInPayload: true, name: "_newMinExchangeRate" },
      ...parameters.slice(1),
      {
        name: "_msgSender",
        type: "address",
        value: parameters[2].value,
        onlyInPayload: true,
      },
    ];
  }

  return (mintChain as EthereumClass).Contract({
    sendTo: Ox(to.toString()),
    contractFn: abi.name || "",
    contractParams: parameters,
  });
};
