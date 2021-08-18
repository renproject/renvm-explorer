import React from "react";
import { SummarizedTransaction } from "../../../../lib/searchResult";
import { Tooltip } from "../../../common/Tooltip";

interface Props {
  queryTx: SummarizedTransaction;
}

export const AmountRows: React.FC<Props> = ({ queryTx }) => {
  return (
    <>
      {queryTx.summary.amountInRaw ? (
        <tr>
          <td>Amount</td>
          <td>
            {queryTx.summary.amountIn ? (
              <>
                {queryTx.summary.amountIn.toFixed()} {queryTx.summary.asset}
              </>
            ) : (
              <span style={{ opacity: 0.3 }}>
                {queryTx.summary.amountInRaw.toFixed()}
              </span>
            )}
          </td>
        </tr>
      ) : null}
      {queryTx.summary.amountInRaw && queryTx.summary.amountOutRaw ? (
        <>
          <tr>
            <td>
              {queryTx.summary.asset} Fee{" "}
              <Tooltip id="renvm-fee">
                Includes the fee set by RenVM and the cost of a{" "}
                {queryTx.summary.asset} transfer.
              </Tooltip>
            </td>
            <td>
              {queryTx.summary.amountIn && queryTx.summary.amountOut ? (
                <>
                  {queryTx.summary.amountIn
                    .minus(queryTx.summary.amountOut)
                    .toFixed()}{" "}
                  {queryTx.summary.asset}
                </>
              ) : (
                <span style={{ opacity: 0.3 }}>
                  {queryTx.summary.amountInRaw
                    .minus(queryTx.summary.amountOutRaw)
                    .toFixed()}
                </span>
              )}
            </td>
          </tr>
        </>
      ) : null}
    </>
  );
};
