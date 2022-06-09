// import { ConnectorConfig } from "@renproject/multiwallet-ui";
import { Chain, ContractChain, RenNetwork } from "@renproject/utils";

export enum ChainType {
    LockChain = "LockChain",
    EVMChain = "EVMChain",
    SolanaChain = "SolanaChain",
}

export interface ChainDetails<ChainClass extends Chain = Chain> {
    chain: string;
    chainPattern: RegExp;
    assets: { [asset: string]: string };
    type: ChainType;
    // primaryColor: "#627eea";
    // textColor: "white";

    usePublicProvider: (network: RenNetwork) => ChainClass | null;

    // multiwalletConfig?: (network: RenNetwork) => Array<ConnectorConfig<any, any>>;

    getOutputParams?: (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ) => Promise<any>;

    getTokenAccount?: (
        mintChain: ContractChain,
        asset: string,
    ) => Promise<string | null>;

    createTokenAccount?: (
        mintChain: ContractChain,
        asset: string,
    ) => Promise<string>;
}
