import {
  EthereumClass,
  AvalancheConfigMap,
  BscConfigMap,
  FantomConfigMap,
  PolygonConfigMap,
} from "@renproject/chains";
import { EthArgs, RenNetwork } from "@renproject/interfaces";
import { INFURA_KEY } from "../../environmentVariables";
import { getEvmABI } from "./getABI";
import { ethers } from "ethers";
import { Ox } from "@renproject/utils";

export const getEthereumProvider = (
  network: RenNetwork
): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(
    `https://${
      network === RenNetwork.Mainnet ? "mainnet" : "kovan"
    }.infura.io/v3/${INFURA_KEY}`
  );
};

export const getBSCProvider = (
  network: RenNetwork
): ethers.providers.JsonRpcProvider => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }
  return new ethers.providers.JsonRpcProvider(
    BscConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  );
};

export const getPolygonProvider = (
  network: RenNetwork
): ethers.providers.JsonRpcProvider => {
  if (network === RenNetwork.DevnetVDot3 || network === RenNetwork.Localnet) {
    throw new Error(`Unsupported network ${network}`);
  }
  return new ethers.providers.JsonRpcProvider(
    PolygonConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  );
};

export const getFantomProvider = (
  network: RenNetwork
): ethers.providers.JsonRpcProvider => {
  if (network === RenNetwork.Localnet) {
    throw new Error("Localnet not supported.");
  }

  return new ethers.providers.JsonRpcProvider(
    FantomConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  );
};

export const getAvalancheProvider = (
  network: RenNetwork
): ethers.providers.JsonRpcProvider => {
  if (network === RenNetwork.DevnetVDot3 || network === RenNetwork.Localnet) {
    throw new Error(`Unsupported network ${network}`);
  }

  return new ethers.providers.JsonRpcProvider(
    AvalancheConfigMap[
      network === RenNetwork.Mainnet
        ? RenNetwork.MainnetVDot3
        : network === RenNetwork.Testnet
        ? RenNetwork.TestnetVDot3
        : network
    ].infura
  );
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

  const abiValues = ethers.utils.defaultAbiCoder.decode(
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
