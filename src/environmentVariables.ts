import { RenNetwork } from "@renproject/utils";

export const NETWORK: RenNetwork =
    (process.env.REACT_APP_NETWORK as RenNetwork) || RenNetwork.Testnet;

export const LIGHTNODE = process.env.REACT_APP_LIGHTNODE || NETWORK;

export const DEBUG =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

// Optional
export const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
// Optional
export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;
