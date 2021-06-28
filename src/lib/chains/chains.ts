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
  EthereumClass,
  Avalanche,
} from "@renproject/chains";
import { ChainCommon, MintChain, RenNetwork } from "@renproject/interfaces";
import {
  getAvalancheProvider,
  getBSCProvider,
  getEthereumMintParams,
  getEthereumProvider,
  getFantomProvider,
  getPolygonProvider,
} from "./ethereum";

export enum Chain {
  Ethereum = "Ethereum",
  BSC = "BinanceSmartChain",
  Fantom = "Fantom",
  Polygon = "Polygon",
  Avalanche = "Avalanche",
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
    case "avalanche":
      return Avalanche(getAvalancheProvider(network), network);
  }
  return null;
};

export const ChainArray = [
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
  Avalanche,
];

export const getMintChainParams = async (
  mintChain: MintChain,
  to: string,
  payload: string
): Promise<MintChain> => {
  switch (mintChain.name) {
    case Ethereum.chain:
    case BinanceSmartChain.chain:
    case Fantom.chain:
    case Polygon.chain:
    case Avalanche.chain:
      return getEthereumMintParams(mintChain as EthereumClass, to, payload);
    default:
      throw new Error(
        `Reconstructing mint parameters for ${mintChain.name} is not supported yet.`
      );
  }
};
