import { RenNetwork } from "@renproject/interfaces";
import { config } from "dotenv";

config();

export const NETWORK: RenNetwork =
  (process.env.REACT_APP_NETWORK as RenNetwork) || RenNetwork.Mainnet;

export const DEBUG = process.env.REACT_APP_DEBUG === "true";

export const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || "";
