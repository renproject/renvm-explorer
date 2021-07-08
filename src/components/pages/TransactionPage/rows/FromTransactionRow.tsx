import React from "react";
import { ExternalLink } from "../../../common/ExternalLink";
import { SummarizedTransaction, TransactionType } from "../../../../lib/searchResult";
import { isDefined } from "@renproject/utils";

interface Props {
  queryTx: SummarizedTransaction;
}

export const FromTransactionRow: React.FC<Props> = ({ queryTx }) => {
  let txid: Buffer | undefined = undefined;
  let txindex: string | undefined = undefined;
  let reversed = true;

  if ((queryTx.result.in as any).txid) {
    txid = (queryTx.result.in as any).txid;
    txindex = (queryTx.result.in as any).txindex;
  } else if (queryTx.transactionType === TransactionType.Mint) {
    txid = Buffer.from(queryTx.result.in.utxo.txHash, "hex");
    txindex = queryTx.result.in.utxo.vOut.toString();
    reversed = false;
  }

  const txHash =
    queryTx.summary.fromChain &&
    txid &&
    txindex &&
    queryTx.summary.fromChain.transactionIDFromRPCFormat(
      Buffer.from(txid),
      txindex,
      reversed
    );

  return isDefined(txid) && isDefined(txindex) && txid.length > 0 ? (
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
                    txHash
                  )}
                >
                  {txHash}
                </ExternalLink>
              ) : (
                txHash
              )}
            </>
          ) : (
            <span style={{ opacity: 0.3 }}>
              {txid.toString("hex")}, {txindex.toString()}
            </span>
          )
        ) : null}
      </td>
    </tr>
  ) : null;
};
