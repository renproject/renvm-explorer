import React from "react";
import { DepositCommon } from "@renproject/interfaces";
import { LockAndMintDeposit } from "@renproject/ren";

import { Link } from "react-router-dom";

interface Props {
  deposit:
    | LockAndMintDeposit<any, DepositCommon<any>, any, any, any>
    | Error
    | undefined
    | null;
}

export const GatewayAddressRow: React.FC<Props> = ({ deposit }) => {
  return deposit && (deposit as any).gatewayAddress ? (
    <tr>
      <td>Gateway address</td>
      <td>
        <Link
          to={`/gateway/${(deposit as any).gatewayAddress}`}
          style={{ textDecoration: "underline" }}
        >
          {(deposit as any).gatewayAddress}
        </Link>
        {/* <i>{" "}- click to search for additional deposits</i> */}
      </td>
    </tr>
  ) : null;
};
