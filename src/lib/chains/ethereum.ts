import { EthereumClass } from "@renproject/chains";
import { EthArgs } from "@renproject/interfaces";
import { getEvmABI } from "./getABI";
import { ethers } from "ethers";
import { fromHex, Ox } from "@renproject/utils";

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
    fromHex(payload)
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
