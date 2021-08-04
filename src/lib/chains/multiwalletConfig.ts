import {
  Avalanche,
  BinanceSmartChain,
  Ethereum,
  Fantom,
  Polygon,
} from "@renproject/chains";
import { RenNetwork } from "@renproject/interfaces";
import { BinanceSmartChainInjectedConnector } from "@renproject/multiwallet-binancesmartchain-injected-connector";
import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { INFURA_KEY } from "../../environmentVariables";

import { Chain } from "./chains";
import { Icons } from "./icons/wallets/index";

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

export const injectedConnectorFactory = (map: {
  [RenNetwork.Mainnet]: { networkID: number };
  [RenNetwork.Testnet]: { networkID: number };
  [RenNetwork.Devnet]?: { networkID: number };
}) => {
  return {
    name: "Metamask",
    logo: Icons.Metamask,
    connector: new EthereumInjectedConnector({
      debug: true,
      networkIdMapper: networkMapper(map),
    }),
  };
};

export const multiwalletOptions: WalletPickerConfig<any, any> = {
  chains: {
    [Chain.Ethereum]: [
      {
        name: "Metamask",
        logo: Icons.Metamask,
        connector: new EthereumInjectedConnector({
          debug: true,
          networkIdMapper: networkMapper(Ethereum.configMap),
        }),
      },
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
    [Chain.BSC]: [
      injectedConnectorFactory(BinanceSmartChain.configMap),
      {
        name: "BinanceSmartWallet",
        logo: Icons.BSC,
        connector: new BinanceSmartChainInjectedConnector({
          debug: true,
          networkIdMapper: networkMapper(BinanceSmartChain.configMap),
        }),
      },
    ],
    [Chain.Fantom]: [injectedConnectorFactory(Fantom.configMap)],
    [Chain.Polygon]: [injectedConnectorFactory(Polygon.configMap)],
    [Chain.Avalanche]: [injectedConnectorFactory(Avalanche.configMap)],
  },
};
