import {
  RenVMCrossChainTransaction,
  ResponseQueryTx,
} from "@renproject/provider";
import { pack } from "@renproject/utils";

export const unmarshalClaimFeesTx = (
  response: ResponseQueryTx
): RenVMCrossChainTransaction => {
  let out;

  const inValue = pack.unmarshal.unmarshalTypedPackValue(response.tx.in);

  if (response.tx.out) {
    out = pack.unmarshal.unmarshalTypedPackValue(response.tx.out);

    // Temporary fix to support v0.4.
    if (out.revert && out.revert.length === 0) {
      out.revert = undefined;
    }
  }

  return {
    version: response.tx.version ? parseInt(response.tx.version) : 1,
    hash: response.tx.hash,
    selector: response.tx.selector,
    in: inValue,
    out,
  };
};
