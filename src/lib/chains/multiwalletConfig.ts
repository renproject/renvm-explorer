import {
  AvalancheConfigMap,
  BscConfigMap,
  EthereumConfigMap,
  FantomConfigMap,
  PolygonConfigMap,
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
    [RenNetwork.MainnetVDot3]: { networkID: number };
    [RenNetwork.TestnetVDot3]: { networkID: number };
    [RenNetwork.DevnetVDot3]?: { networkID: number };
  }) =>
  (id: string | number): RenNetwork => {
    return {
      [map[RenNetwork.MainnetVDot3].networkID]: RenNetwork.Mainnet,
      [map[RenNetwork.TestnetVDot3].networkID]: RenNetwork.Testnet,
      [map[RenNetwork.DevnetVDot3]!.networkID]: RenNetwork.DevnetVDot3,
    }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
  };

export const injectedConnectorFactory = (map: {
  [RenNetwork.MainnetVDot3]: { networkID: number };
  [RenNetwork.TestnetVDot3]: { networkID: number };
  [RenNetwork.DevnetVDot3]?: { networkID: number };
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
          networkIdMapper: networkMapper(EthereumConfigMap),
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
          networkIdMapper: networkMapper(EthereumConfigMap),
        }),
      },
    ],
    [Chain.BSC]: [
      injectedConnectorFactory(BscConfigMap),
      {
        name: "BinanceSmartWallet",
        logo: Icons.BSC,
        connector: new BinanceSmartChainInjectedConnector({
          debug: true,
          networkIdMapper: networkMapper(BscConfigMap),
        }),
      },
    ],
    [Chain.Fantom]: [injectedConnectorFactory(FantomConfigMap)],
    [Chain.Polygon]: [injectedConnectorFactory(PolygonConfigMap)],
    [Chain.Avalanche]: [injectedConnectorFactory(AvalancheConfigMap)],
  },
};
