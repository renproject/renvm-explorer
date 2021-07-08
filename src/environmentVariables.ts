import { RenNetwork } from "@renproject/interfaces";
import { config } from "dotenv";

config();

export const NETWORK: RenNetwork =
  (process.env.NETWORK as RenNetwork) || RenNetwork.Testnet;

export const DEBUG = process.env.REACT_APP_DEBUG === "true";

export const INFURA_KEY = process.env.REACT_APP_INFURA_KEY || "";
