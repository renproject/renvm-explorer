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
import { EthArgs } from "@renproject/interfaces";
import { fromHex, Ox } from "@renproject/utils";
import { MintChain, RenNetwork } from "@renproject/interfaces";
import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { ethers } from "ethers";

import { INFURA_KEY } from "../../../environmentVariables";
import { Icons } from "../icons/wallets";
import { injectedConnectorFactory, networkMapper } from "../multiwalletConfig";
import { getEvmABI } from "../getABI";
import { ChainDetails } from "./types";

export const EthereumDetails: ChainDetails<Ethereum> = {
  chain: Ethereum.chain,
  chainPattern: /^(ethereum|eth)$/i,
  usePublicProvider: (network: RenNetwork) =>
    getPublicEthereumProvider<Ethereum>(Ethereum, network),

  multiwalletConfig: [
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

  multiwalletConfig: [injectedConnectorFactory(BinanceSmartChain.configMap)],

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

  multiwalletConfig: [injectedConnectorFactory(Fantom.configMap)],

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

  multiwalletConfig: [injectedConnectorFactory(Polygon.configMap)],

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

  multiwalletConfig: [injectedConnectorFactory(Avalanche.configMap)],

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

  multiwalletConfig: [injectedConnectorFactory(Goerli.configMap)],

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

  multiwalletConfig: [injectedConnectorFactory(Arbitrum.configMap)],

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
    new (...p: any[]): T;
    configMap: { [network: string]: EthereumConfig };
  },
  network: RenNetwork
): T => {
  const config = Class.configMap[network as any];
  if (!config) {
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

  const abi = abiFull.filter(
    (abi) =>
      abi.inputs &&
      abi.inputs.length >= 3 &&
      (abi.inputs[abi.inputs?.length - 3].type === "uint256" ||
        abi.inputs[abi.inputs?.length - 3].type === "uint") &&
      abi.inputs[abi.inputs?.length - 2].type === "bytes32" &&
      abi.inputs[abi.inputs?.length - 1].type === "bytes"
  )[0];

  const abiValues = ethers.utils.defaultAbiCoder.decode(
    (abi.inputs?.slice(0, -3) || []).map((x) => x.type),
    fromHex(payload)
  );

  const parameters: EthArgs = (abi.inputs?.slice(0, -3) || []).map(
    (abiItem, i) => ({
      name: abiItem.name,
      type: abiItem.type,
      value: abiValues[i],
    })
  );

  return (mintChain as EthereumClass).Contract({
    sendTo: Ox(to.toString()),
    contractFn: abi.name || "",
    contractParams: parameters,
  });
};
