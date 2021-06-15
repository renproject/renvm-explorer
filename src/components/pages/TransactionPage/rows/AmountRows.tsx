import React from "react";
import {
  BurnAndReleaseTransaction,
  LockAndMintTransaction,
} from "@renproject/interfaces";
import { TransactionSummary } from "../../../../lib/searchResult";
import { Tooltip } from "../../../common/Tooltip";

interface Props {
  queryTx:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      };
}

export const AmountRows: React.FC<Props> = ({ queryTx }) => {
  return (
    <>
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
      {queryTx.summary.amountOutRaw ? (
        <>
          <tr>
            <td>{queryTx.summary.asset} Fee</td>
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
          <tr>
            <td>RenVM Fee</td>
            <td>
              <Tooltip id="renvm-fee">
                RenVM fees will soon be included in the "{queryTx.summary.asset}{" "}
                Fee" section.
              </Tooltip>
            </td>
          </tr>
        </>
      ) : null}
    </>
  );
};
