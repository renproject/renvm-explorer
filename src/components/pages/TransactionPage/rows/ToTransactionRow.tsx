import React from "react";
import { DepositCommon } from "@renproject/interfaces";
import { LockAndMintDeposit } from "@renproject/ren";
import { ExternalLink } from "../../../common/ExternalLink";
import {
  BurnAndReleaseTransaction,
  LockAndMintTransaction,
} from "@renproject/interfaces";
import { TransactionSummary } from "../../../../lib/searchResult";

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
  deposit:
    | LockAndMintDeposit<any, DepositCommon<any>, any, any, any>
    | Error
    | undefined
    | null;
}

export const ToTransactionRow: React.FC<Props> = ({ queryTx, deposit }) => {
  if (queryTx.isMint) {
    // Mint

    return deposit && !(deposit instanceof Error) && deposit.mintTransaction ? (
      <tr>
        <td>{deposit.params.to.name} transaction</td>
        <td>
          {deposit.params.to.utils.transactionExplorerLink ? (
            <ExternalLink
              href={deposit.params.to.utils.transactionExplorerLink(
                deposit.mintTransaction
              )}
            >
              {deposit.params.to.transactionID(deposit.mintTransaction)}
            </ExternalLink>
          ) : (
            deposit.params.to.transactionID(deposit.mintTransaction)
          )}
        </td>
      </tr>
    ) : null;
  } else {
    // Burn

    if (queryTx.result.out && (queryTx.result.out as any).txid) {
      return (
        <tr>
          <td>
            {queryTx.summary.toChain
              ? queryTx.summary.toChain.name
              : queryTx.summary.to}{" "}
            transaction
          </td>
          <td>
            {queryTx.summary.toChain ? (
              <>
                {queryTx.summary.toChain.utils.transactionExplorerLink ? (
                  <ExternalLink
                    href={queryTx.summary.toChain.utils.transactionExplorerLink(
                      queryTx.summary.toChain.transactionIDFromRPCFormat(
                        (queryTx.result.out as any).txid,
                        (queryTx.result.out as any).txindex,
                        true
                      )
                    )}
                  >
                    {queryTx.summary.toChain.transactionIDFromRPCFormat(
                      (queryTx.result.out as any).txid,
                      (queryTx.result.out as any).txindex,
                      true
                    )}
                  </ExternalLink>
                ) : (
                  queryTx.summary.toChain.transactionIDFromRPCFormat(
                    (queryTx.result.out as any).txid,
                    (queryTx.result.out as any).txindex,
                    true
                  )
                )}
              </>
            ) : (
              <span style={{ opacity: 0.3 }}>
                {(queryTx.result.out as any).txid.toString("hex")},{" "}
                {(queryTx.result.out as any).txindex.toString()}
              </span>
            )}
          </td>
        </tr>
      );
    } else {
      return null;
    }
  }
};
