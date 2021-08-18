import { LockChain, MintChain, RenNetwork } from "@renproject/interfaces";
import { ConnectorConfig } from "@renproject/multiwallet-ui";

export interface ChainDetails<
  ChainType extends MintChain | LockChain = MintChain | LockChain
> {
  chain: string;
  chainPattern: RegExp;

  usePublicProvider: (network: RenNetwork) => ChainType | null;

  nativeAssets: Array<{
    symbol: string;
    name: string;
  }>;

  multiwalletConfig?: Array<ConnectorConfig<any, any>>;

  getMintParams?: (
    mintChain: MintChain,
    to: string,
    payload: string
  ) => Promise<MintChain>;
}
