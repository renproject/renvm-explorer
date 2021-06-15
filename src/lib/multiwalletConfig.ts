import { RenNetwork } from "@renproject/interfaces";
import { BinanceSmartChainInjectedConnector } from "@renproject/multiwallet-binancesmartchain-injected-connector";
import { EthereumInjectedConnector } from "@renproject/multiwallet-ethereum-injected-connector";
import { EthereumWalletConnectConnector } from "@renproject/multiwallet-ethereum-walletconnect-connector";
import { WalletPickerConfig } from "@renproject/multiwallet-ui";
import { INFURA_KEY } from "../environmentVariables";

import { Chain } from "./chains";
import { Icons } from "./icons/index";

export const ethNetworkToRenNetwork = (id: string | number): RenNetwork => {
  return {
    1: RenNetwork.Mainnet,
    4: RenNetwork.Testnet,
    42: RenNetwork.Testnet,
  }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
};

export const bscNetworkToRenNetwork = (id: string | number): RenNetwork => {
  return {
    56: RenNetwork.Mainnet,
    97: RenNetwork.Testnet,
  }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
};

export const fantomNetworkToRenNetwork = (id: string | number): RenNetwork => {
  return {
    250: RenNetwork.Mainnet,
    4002: RenNetwork.Testnet,
  }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
};

export const polygonNetworkToRenNetwork = (id: string | number): RenNetwork => {
  return {
    137: RenNetwork.Mainnet,
    80001: RenNetwork.Testnet,
  }[parseInt(id as string)] as RenNetwork; // tslint:disable-line: radix
};

export const multiwalletOptions: WalletPickerConfig<any, any> = {
  chains: {
    [Chain.Ethereum]: [
      {
        name: "Metamask",
        logo: Icons.Metamask,
        connector: new EthereumInjectedConnector({
          debug: true,
          networkIdMapper: ethNetworkToRenNetwork,
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
          networkIdMapper: ethNetworkToRenNetwork,
        }),
      },
    ],
    [Chain.Fantom]: [
      {
        name: "Metamask",
        logo: Icons.Metamask,
        connector: new EthereumInjectedConnector({
          debug: true,
          networkIdMapper: fantomNetworkToRenNetwork,
        }),
      },
    ],
    [Chain.Polygon]: [
      {
        name: "Metamask",
        logo: Icons.Metamask,
        connector: new EthereumInjectedConnector({
          debug: true,
          networkIdMapper: polygonNetworkToRenNetwork,
        }),
      },
    ],
    [Chain.BSC]: [
      {
        name: "Metamask",
        logo: Icons.Metamask,
        connector: new EthereumInjectedConnector({
          debug: true,
          networkIdMapper: bscNetworkToRenNetwork,
        }),
      },
      {
        name: "BinanceSmartWallet",
        logo: Icons.BSC,
        connector: new BinanceSmartChainInjectedConnector({
          debug: true,
          networkIdMapper: bscNetworkToRenNetwork,
        }),
      },
    ],
  },
};
