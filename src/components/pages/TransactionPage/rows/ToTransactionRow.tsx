import React from "react";

import { GatewayTransaction } from "@renproject/ren";
import { utils } from "@renproject/utils";

import {
  SummarizedTransaction,
  TransactionType,
} from "../../../../lib/searchResult";
import { ExternalLink } from "../../../common/ExternalLink";

interface Props {
  queryTx: SummarizedTransaction;
  deposit: GatewayTransaction | Error | undefined | null;
}

export const ToTransactionRow: React.FC<Props> = ({ queryTx, deposit }) => {
  if (
    queryTx.result.out &&
    (queryTx.result.out as any).txid &&
    (queryTx.result.out as any).txid.length > 0
  ) {
    return (
      <tr>
        <td>
          {queryTx.summary.toChain
            ? queryTx.summary.toChain.chain
            : queryTx.summary.to}{" "}
          transaction
        </td>
        <td>
          {queryTx.summary.toChain ? (
            <>
              {queryTx.summary.toChain.transactionExplorerLink({
                txid: utils.toURLBase64(queryTx.result.out.txid),
                txindex: queryTx.result.out.txindex.toFixed(),
              }) ? (
                <ExternalLink
                  href={queryTx.summary.toChain.transactionExplorerLink({
                    txid: utils.toURLBase64(queryTx.result.out.txid),
                    txindex: queryTx.result.out.txindex.toFixed(),
                  })}
                >
                  {queryTx.summary.toChain.txidToTxidFormatted({
                    txid: utils.toURLBase64(queryTx.result.out.txid),
                    txindex: queryTx.result.out.txindex.toFixed(),
                  })}
                </ExternalLink>
              ) : (
                queryTx.summary.toChain.txidToTxidFormatted({
                  txid: utils.toURLBase64(queryTx.result.out.txid),
                  txindex: queryTx.result.out.txindex.toFixed(),
                })
              )}
            </>
          ) : (
            <span style={{ opacity: 0.3 }}>
              {utils.toURLBase64(queryTx.result.out.txid)},{" "}
              {queryTx.result.out.txindex.toFixed()}
            </span>
          )}
        </td>
      </tr>
    );
  } else {
    return null;
  }
};
