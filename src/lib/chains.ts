import {
  Bitcoin,
  Zcash,
  BitcoinCash,
  Dogecoin,
  Filecoin,
  DigiByte,
  Terra,
  Ethereum,
  BinanceSmartChain,
  Fantom,
  Polygon,
} from "@renproject/chains";
import {
  BscConfigMap,
  FantomConfigMap,
  PolygonConfigMap,
} from "@renproject/chains";
import { ChainCommon, RenNetwork } from "@renproject/interfaces";
import Web3 from "web3";
import { provider } from "web3-providers";
import { INFURA_KEY } from "../environmentVariables";

export enum Chain {
  Ethereum = "Ethereum",
  BSC = "BinanceSmartChain",
  Fantom = "Fantom",
  Polygon = "Polygon",
}

export const Chains = new Map<Chain, { symbol: Chain; name: string }>()
  .set(Chain.Ethereum, {
    symbol: Chain.Ethereum,
    name: "Ethereum",
  })
  .set(Chain.Fantom, {
    symbol: Chain.Fantom,
    name: "Fantom",
  })
  .set(Chain.Polygon, {
    symbol: Chain.Polygon,
    name: "Polygon",
  });

export const defaultMintChain = Chain.Ethereum;

export enum Asset {
  BTC = "BTC",
  ZEC = "ZEC",
  BCH = "BCH",
  FIL = "FIL",
  LUNA = "LUNA",
  DOGE = "DOGE",
}
export let Assets = new Map<Asset, { symbol: Asset; name: string }>()
  .set(Asset.BTC, {
    symbol: Asset.BTC,
    name: "Bitcoin",
  })
  .set(Asset.ZEC, {
    symbol: Asset.ZEC,
    name: "Zcash",
  })
  .set(Asset.BCH, {
    symbol: Asset.BCH,
    name: "BitcoinCash",
  })
  .set(Asset.FIL, {
    symbol: Asset.FIL,
    name: "Filecoin",
  })
  .set(Asset.LUNA, {
    symbol: Asset.LUNA,
    name: "Luna",
  })
  .set(Asset.DOGE, {
    symbol: Asset.DOGE,
    name: "Dogecoin",
  });

export const defaultAsset = Asset.FIL;

const getEthereumProvider = (network: RenNetwork): provider => {
  return new Web3(
    `https://${
      network === RenNetwork.Mainnet ? "mainnet" : "kovan"
    }.infura.io/v3/${INFURA_KEY}`
  ).currentProvider;
};

const getBSCProvider = (network: RenNetwork): provider => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }
  return new Web3(
    BscConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

const getPolygonProvider = (network: RenNetwork): provider => {
  if (network === RenNetwork.DevnetVDot3 || network === RenNetwork.Localnet) {
    throw new Error(`Unsupported network ${network}`);
  }
  return new Web3(
    PolygonConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

const getFantomProvider = (network: RenNetwork): provider => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }

  return new Web3(
    FantomConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

export const ChainMapper = (
  chain: string,
  network: RenNetwork
): ChainCommon | null => {
  switch (chain.toLowerCase()) {
    case "bitcoin":
    case "btc":
      return Bitcoin();
    case "zcash":
    case "zec":
      return Zcash();
    case "bitcoincash":
    case "bch":
      return BitcoinCash();
    case "dogecoin":
    case "doge":
      return Dogecoin();
    case "filecoin":
    case "fil":
      return Filecoin();
    case "digibyte":
    case "dgb":
      return DigiByte();
    case "terra":
    case "luna":
      return Terra();
    case "ethereum":
    case "eth":
      return Ethereum(getEthereumProvider(network), network);
    case "binancesmartchain":
    case "bsc":
      return BinanceSmartChain(getBSCProvider(network), network);
    case "fantom":
      return Fantom(getFantomProvider(network), network);
    case "polygon":
      return Polygon(getPolygonProvider(network), network);
  }
  return null;
};
