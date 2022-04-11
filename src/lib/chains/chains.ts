import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { Chain, ContractChain, RenNetwork } from "@renproject/utils";

import {
    ArbitrumDetails,
    AvalancheDetails,
    BinanceSmartChainDetails,
    EthereumDetails,
    FantomDetails,
    GoerliDetails,
    PolygonDetails,
} from "./chains/evmChains";
import {
    BitcoinCashDetails,
    BitcoinDetails,
    DibiByteDetails,
    DogecoinDetails,
    FilecoinDetails,
    LunaDetails,
    ZcashDetails,
} from "./chains/lockChains";
import { SolanaDetails } from "./chains/solana";

export const mintChains = [
  EthereumDetails,
  BinanceSmartChainDetails,
  FantomDetails,
  PolygonDetails,
  AvalancheDetails,
  GoerliDetails,
  ArbitrumDetails,
  SolanaDetails,
];

export const lockChains = [
  BitcoinDetails,
  ZcashDetails,
  BitcoinCashDetails,
  DibiByteDetails,
  FilecoinDetails,
  LunaDetails,
  DogecoinDetails,
];

export const allChains = [...mintChains, ...lockChains];

export const multiwalletOptions = (
  network: RenNetwork
): WalletPickerConfig<any, any> => {
  const chains = allChains.reduce((acc, chain) => {
    if (chain.multiwalletConfig) {
      return {
        ...acc,
        [chain.chain]: chain.multiwalletConfig(network),
      };
    } else {
      return acc;
    }
  }, {});
  return { chains };
};

export const ChainMapper = (
  chainName: string,
  network: RenNetwork
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
  asset: string
): Promise<ContractChain> => {
  for (const chainDetails of mintChains) {
    if (chainDetails.chainPattern.exec(mintChain.chain)) {
      if (chainDetails && chainDetails.getMintParams) {
        return chainDetails.getMintParams(mintChain, to, payload, asset);
      } else {
        throw new Error(
          `Reconstructing mint parameters for ${mintChain.chain} is not supported yet.`
        );
      }
    }
  }

  throw new Error(`Unable to get parameters for ${mintChain.chain}`);
};
