import React, { useCallback } from "react";
import { LockAndMint } from "@renproject/ren";

import { Link, useHistory } from "react-router-dom";
import { RenVMGateway } from "../../../../lib/searchResult";
import { UIContainer } from "../../../../containers/UIContainer";
import { SummarizedTransaction } from "../../../../lib/searchResult";

interface Props {
  queryTx: SummarizedTransaction;
  lockAndMint: LockAndMint | Error | undefined | null;
}

export const GatewayAddressRow: React.FC<Props> = ({
  queryTx,
  lockAndMint,
}) => {
  const { setSearchResult } = UIContainer.useContainer();
  const history = useHistory();

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.preventDefault();

      if (!lockAndMint || lockAndMint instanceof Error) {
        return;
      }

      const gatewayAddress = lockAndMint.gatewayAddress;
      if (!gatewayAddress) {
        return;
      }

      const result = RenVMGateway(
        gatewayAddress,
        {
          ...queryTx,
          summary: {
            ...queryTx.summary,
            amountIn: undefined,
            amountInRaw: undefined,
          },
        } as any,
        lockAndMint
      );
      setSearchResult(result);
      history.push(result.resultPath);
    },
    [history, setSearchResult, lockAndMint, queryTx]
  );

  return lockAndMint && !(lockAndMint instanceof Error) ? (
    <tr>
      <td>Gateway address</td>
      <td>
        <Link
          onClick={onClick}
          to={`/gateway/${lockAndMint.gatewayAddress}`}
          style={{ textDecoration: "underline" }}
        >
          {lockAndMint.gatewayAddress}
        </Link>
        {/* <i>{" "}- click to search for additional deposits</i> */}
      </td>
    </tr>
  ) : null;
};
