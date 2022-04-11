import { ConnectorConfig } from "@renproject/multiwallet-ui";
import { Chain, ContractChain, RenNetwork } from "@renproject/utils";

export interface ChainDetails<ChainType extends Chain = Chain> {
  chain: string;
  chainPattern: RegExp;

  usePublicProvider: (network: RenNetwork) => ChainType | null;

  nativeAssets: Array<{
    symbol: string;
    name: string;
  }>;

  multiwalletConfig?: (network: RenNetwork) => Array<ConnectorConfig<any, any>>;

  getMintParams?: (
    mintChain: ContractChain,
    to: string,
    payload: string,
    asset: string
  ) => Promise<any>;

  getTokenAccount?: (
    mintChain: ContractChain,
    asset: string
  ) => Promise<string | null>;

  createTokenAccount?: (
    mintChain: ContractChain,
    asset: string
  ) => Promise<string>;
}
