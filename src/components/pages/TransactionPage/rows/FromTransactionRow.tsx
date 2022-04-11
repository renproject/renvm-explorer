import React from "react";

import { utils } from "@renproject/utils";

import {
  SummarizedTransaction,
  TransactionType,
} from "../../../../lib/searchResult";
import { ExternalLink } from "../../../common/ExternalLink";

interface Props {
  queryTx: SummarizedTransaction;
}

export const FromTransactionRow: React.FC<Props> = ({ queryTx }) => {
  let txid: Buffer | undefined = undefined;
  let txindex: string | undefined = undefined;

  if ((queryTx.result.in as any).txid) {
    txid = (queryTx.result.in as any).txid;
    txindex = (queryTx.result.in as any).txindex;
  } else if (queryTx.transactionType === TransactionType.Mint) {
    txid = Buffer.from(queryTx.result.in.txid);
    txindex = queryTx.result.in.txindex.toFixed();
  }

  const txHash =
    queryTx.summary.fromChain &&
    txid &&
    txindex &&
    queryTx.summary.fromChain.txidToTxidFormatted({
      txid: utils.toURLBase64(txid),
      txindex,
    });

  return utils.isDefined(txid) &&
    utils.isDefined(txindex) &&
    txid.length > 0 ? (
    <tr>
      <td>
        {queryTx.summary.fromChain
          ? queryTx.summary.fromChain.chain
          : queryTx.summary.from}{" "}
        transaction
      </td>
      <td>
        {txid ? (
          queryTx.summary.fromChain ? (
            <>
              {txHash && queryTx.summary.fromChain.transactionExplorerLink ? (
                <ExternalLink
                  href={queryTx.summary.fromChain.transactionExplorerLink({
                    txidFormatted: txHash,
                  })}
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
