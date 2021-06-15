import React from "react";
import { ExternalLink } from "../../../common/ExternalLink";
import {
  BurnAndReleaseTransaction,
  LockAndMintTransaction,
} from "@renproject/interfaces";
import { TransactionSummary } from "../../../../lib/searchResult";
import { isDefined } from "@renproject/utils";

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

export const FromTransactionRow: React.FC<Props> = ({ queryTx }) => {
  let txid: Buffer | undefined = undefined;
  let txindex: string | undefined = undefined;
  let reversed = true;

  if ((queryTx.result.in as any).txid) {
    txid = (queryTx.result.in as any).txid;
    txindex = (queryTx.result.in as any).txindex;
  } else if (queryTx.isMint) {
    txid = Buffer.from(queryTx.result.in.utxo.txHash, "hex");
    txindex = queryTx.result.in.utxo.vOut.toString();
    reversed = false;
  }

  return isDefined(txid) && isDefined(txindex) ? (
    <tr>
      <td>
        {queryTx.summary.fromChain
          ? queryTx.summary.fromChain.name
          : queryTx.summary.from}{" "}
        transaction
      </td>
      <td>
        {txid ? (
          queryTx.summary.fromChain ? (
            <>
              {queryTx.summary.fromChain.utils.transactionExplorerLink ? (
                <ExternalLink
                  href={queryTx.summary.fromChain.utils.transactionExplorerLink(
                    queryTx.summary.fromChain.transactionIDFromRPCFormat(
                      txid,
                      txindex,
                      reversed
                    )
                  )}
                >
                  {queryTx.summary.fromChain.transactionIDFromRPCFormat(
                    txid,
                    txindex,
                    reversed
                  )}
                </ExternalLink>
              ) : (
                queryTx.summary.fromChain.transactionIDFromRPCFormat(
                  txid,
                  txindex,
                  reversed
                )
              )}
            </>
          ) : (
            <span style={{ opacity: 0.3 }}>
              {txid.toString("hex")}, {txindex.toString()}
            </span>
          )
        ) : (
          <>{queryTx.isMint ? null : null}</>
        )}
      </td>
    </tr>
  ) : null;
};
