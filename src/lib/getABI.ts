import { Fantom, Polygon } from "@renproject/chains";
import { BinanceSmartChain, Ethereum } from "@renproject/chains-ethereum";
import { AbiItem, ChainCommon, RenNetwork } from "@renproject/interfaces";
import { Ox } from "@renproject/utils";
import { NETWORK } from "../environmentVariables";
import Axios from "axios";
import { TaggedError } from "./taggedError";

export enum ABIError {
  ContractNotVerified = "Contract not verified.",
  ChainNotSupported = "Fetching ABI not supported on host-chain.",
}

type ABITactic = (chain: ChainCommon, to: string) => Promise<AbiItem[]>;

export const etherscanAPIMap: {
  [chain: string]: { [network: string]: string };
} = {
  [Ethereum.chain]: {
    [RenNetwork.Mainnet]: "https://api.etherscan.io/api",
    [RenNetwork.Testnet]: "https://api-kovan.etherscan.io/api",
  },
  [BinanceSmartChain.chain]: {
    [RenNetwork.Mainnet]: "https://api.bscscan.com/api",
    [RenNetwork.Testnet]: "https://api-testnet.bscscan.com/api",
  },
  [Fantom.chain]: {
    [RenNetwork.Mainnet]: "https://api.ftmscan.com/api",
    [RenNetwork.Testnet]: "https://api-testnet.ftmscan.com/api",
  },
  [Polygon.chain]: {
    [RenNetwork.Mainnet]: "https://api.polygonscan.com/api",
    [RenNetwork.Testnet]: "https://api-testnet.polygonscan.com/api",
  },
};

const getProxy = (address: string): string => {
  if (address.toLowerCase() === "0xb6ea1d3fb9100a2cf166febe11f24367b5fcd24a") {
    return "0x1362e51c1aa40fd180824d4a7fc4f27e2bb3efe5";
  }
  return address;
};

const getABIFromEtherscan: ABITactic = async (
  chain: ChainCommon,
  to: string
): Promise<AbiItem[]> => {
  if (etherscanAPIMap[chain.name] && etherscanAPIMap[chain.name][NETWORK]) {
    const api = etherscanAPIMap[chain.name][NETWORK];
    const url = `${api}?module=contract&action=getabi&address=${getProxy(
      Ox(to.toString())
    )}`;
    const response = await Axios.get<{
      status: "0" | "1";
      message: string;
      result: string;
    }>(url);
    const {
      data: { status, result },
    } = response;
    if (status === "0") {
      if (result === "Contract source code not verified") {
        throw new TaggedError(result, ABIError.ContractNotVerified);
      }
      if (
        result ===
        "Max rate limit reached, please use API Key for higher rate limit"
      ) {
        throw new Error(
          "Error fetching contract ABI - try again in 5 seconds."
        );
      }
      throw new Error(result);
    } else {
      return JSON.parse(result);
    }
  }
  throw new TaggedError(ABIError.ChainNotSupported);
};

/**
 * getEvmABI takes an EVM-based chain and an address, and attempts to fetch
 * the ABI of the contract deployed at that address.
 *
 * It requires (1) the chain to have an Etherscan instance and (2) the contract
 * to be verified.
 *
 * @param chain An EVM-based chain
 * @param to A smart contract's address
 * @returns An AbiItem[], or ABIError if fetching the ABI is not possible.
 */
export const getEvmABI = async (
  chain: ChainCommon,
  to: string
): Promise<AbiItem[]> => {
  const tactics: ABITactic[] = [getABIFromEtherscan];

  for (const tactic of tactics) {
    try {
      return await tactic(chain, to);
    } catch (error) {
      if ((error as TaggedError)._tag === ABIError.ChainNotSupported) {
        continue;
      }
      throw error;
    }
  }

  throw new TaggedError(ABIError.ChainNotSupported);
};
