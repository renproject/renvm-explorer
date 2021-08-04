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
  EthereumConfig,
  BscConfigMap,
  FantomConfigMap,
  PolygonConfigMap,
  AvalancheConfigMap,
  GoerliConfigMap,
  Goerli,
  EthereumConfigMap,
} from "@renproject/chains";
import { TerraNetwork } from "@renproject/chains-terra/build/main/api/deposit";
import { ChainCommon, MintChain, RenNetwork } from "@renproject/interfaces";
import { ethers } from "ethers";
import { INFURA_KEY } from "../../environmentVariables";
import { getEthereumMintParams } from "./ethereum";

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
  let config: EthereumConfig | undefined;
  let provider: ethers.providers.JsonRpcProvider;
  let signer: ethers.providers.JsonRpcSigner;
  switch (chain.toLowerCase()) {
    case "bitcoin":
    case "btc":
      return Bitcoin(network === RenNetwork.Mainnet ? "mainnet" : "testnet");
    case "zcash":
    case "zec":
      return Zcash(network === RenNetwork.Mainnet ? "mainnet" : "testnet");
    case "bitcoincash":
    case "bch":
      return BitcoinCash(
        network === RenNetwork.Mainnet ? "mainnet" : "testnet"
      );
    case "dogecoin":
    case "doge":
      return Dogecoin(network === RenNetwork.Mainnet ? "mainnet" : "testnet");
    case "filecoin":
    case "fil":
      return Filecoin(network === RenNetwork.Mainnet ? "mainnet" : "testnet");
    case "digibyte":
    case "dgb":
      return DigiByte(network === RenNetwork.Mainnet ? "mainnet" : "testnet");
    case "terra":
    case "luna":
      return Terra(
        network === RenNetwork.Mainnet
          ? TerraNetwork.Columbus
          : TerraNetwork.Tequila
      );
    case "ethereum":
    case "eth":
      config = (EthereumConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return Ethereum({ provider, signer }, network);
    case "binancesmartchain":
    case "bsc":
      config = (BscConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return BinanceSmartChain({ provider, signer }, network);
    case "fantom":
      config = (FantomConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return Fantom({ provider, signer }, network);
    case "polygon":
      config = (PolygonConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return Polygon({ provider, signer }, network);
    case "avalanche":
      config = (AvalancheConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return Avalanche({ provider, signer }, network);
    case "goerli":
      config = (GoerliConfigMap as { [network: string]: EthereumConfig })[
        network as any
      ];
      if (!config) {
      }
      provider = new ethers.providers.JsonRpcProvider(
        config?.publicProvider({ infura: INFURA_KEY })
      );
      signer = provider.getSigner();
      return Goerli({ provider, signer }, network);
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
