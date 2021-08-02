import { EthereumClass, AvalancheConfigMap } from "@renproject/chains";
import {
  BscConfigMap,
  FantomConfigMap,
  PolygonConfigMap,
} from "@renproject/chains";
import { EthArgs, RenNetwork } from "@renproject/interfaces";
import Web3 from "web3";
// import { provider } from "web3-providers";
import { INFURA_KEY } from "../../environmentVariables";
import { getEvmABI } from "./getABI";
import AbiCoder from "web3-eth-abi";
import { Ox } from "@renproject/utils";

export const getEthereumProvider = (network: RenNetwork): any => {
  return new Web3(
    `https://${
      network === RenNetwork.Mainnet ? "mainnet" : "kovan"
    }.infura.io/v3/${INFURA_KEY}`
  ).currentProvider;
};

export const getBSCProvider = (network: RenNetwork): any => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }
  return new Web3(
    BscConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

export const getPolygonProvider = (network: RenNetwork): any => {
  if (network === RenNetwork.DevnetVDot3 || network === RenNetwork.Localnet) {
    throw new Error(`Unsupported network ${network}`);
  }
  return new Web3(
    PolygonConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

export const getFantomProvider = (network: RenNetwork): any => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }

  return new Web3(
    FantomConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

export const getAvalancheProvider = (network: RenNetwork): any => {
  if (network === RenNetwork.DevnetVDot3 || network === RenNetwork.Localnet) {
    throw new Error(`Unsupported network ${network}`);
  }

  return new Web3(
    AvalancheConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  ).currentProvider;
};

export const getEthereumMintParams = async (
  mintChain: EthereumClass,
  to: string,
  payload: string
) => {
  const abiFull = await getEvmABI(mintChain, to);
  if (!Array.isArray(abiFull)) {
    throw new Error(abiFull);
  }

  const abi = abiFull.filter(
    (abi) =>
      abi.inputs &&
      abi.inputs.length >= 3 &&
      (abi.inputs[abi.inputs?.length - 3].type === "uint256" ||
        abi.inputs[abi.inputs?.length - 3].type === "uint") &&
      abi.inputs[abi.inputs?.length - 2].type === "bytes32" &&
      abi.inputs[abi.inputs?.length - 1].type === "bytes"
  )[0];

  const abiValues = (AbiCoder as any as AbiCoder.AbiCoder).decodeParameters(
    (abi.inputs?.slice(0, -3) || []).map((x) => x.type),
    payload
  );

  const parameters: EthArgs = (abi.inputs?.slice(0, -3) || []).map(
    (abiItem, i) => ({
      name: abiItem.name,
      type: abiItem.type,
      value: abiValues[i],
    })
  );

  return (mintChain as EthereumClass).Contract({
    sendTo: Ox(to.toString()),
    contractFn: abi.name || "",
    contractParams: parameters,
  });
};
