import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { UIContainer } from "../../containers/UIContainer";
import {
  RenVMTransaction,
  SummarizedTransaction,
} from "../../lib/searchResult";
import { ChainIcon } from "../common/ChainIcon";

interface Props {
  queryTx: SummarizedTransaction;
  refreshed: boolean;
}

export const TransactionPreview: React.FC<Props> = ({ queryTx, refreshed }) => {
  const { setSearchResult } = UIContainer.useContainer();
  const history = useHistory();

  const txHash = queryTx.result.hash;

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.preventDefault();
      setSearchResult(RenVMTransaction(txHash, queryTx));

      // TODO: Investigate alternative to using setTimeout to avoid tx page
      // jumping between transactions.
      // To reproduce: set the timeout to 0 and then on the recent txs page,
      // click one tx, go back and then click another tx.
      setTimeout(() => {
        history.push(`/tx/${encodeURIComponent(txHash)}`);
      }, 100);
    },
    [history, setSearchResult, queryTx, txHash]
  );

  const from = queryTx.summary.fromChain
    ? queryTx.summary.fromChain.name
    : queryTx.summary.from;

  const to = queryTx.summary.toChain
    ? queryTx.summary.toChain.name
    : queryTx.summary.to;

  const [newlyAdded, setNewlyAdded] = useState(false);
  useEffect(() => {
    setNewlyAdded(true);
    setTimeout(() => setNewlyAdded(false), 1 * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        paddingBottom: 10,
        paddingTop: 10,
        alignItems: "center",
        background: refreshed && newlyAdded ? "rgb(238, 247, 219)" : undefined,
        transition: "background 1s ease-in-out",
      }}
    >
      <div
        style={{
          justifyContent: "center",
          fontSize: "16px",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          flex: "2",
          overflow: "hidden",
        }}
      >
        <Link
          key={txHash}
          onClick={onClick}
          to={""}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {queryTx.result.hash}
        </Link>
      </div>
      <div
        style={{
          justifyContent: "center",
          fontSize: "16px",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          flex: "1",
        }}
      >
        <ChainIcon
          style={{ marginRight: 5, fill: "#001732" }}
          chainName={from}
        />
        {from}
      </div>
      <span style={{ margin: "0px 10px" }}>{" → "}</span>
      <div
        style={{
          justifyContent: "center",
          fontSize: "16px",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          color: "#001732",
          flex: "1",
        }}
      >
        {queryTx.summary.amountIn &&
        !queryTx.summary.amountIn.isNaN() &&
        !queryTx.summary.amountIn.isZero()
          ? queryTx.summary.amountIn.toFixed()
          : ""}{" "}
        {queryTx.summary.asset}
      </div>
      <span style={{ margin: "0px 10px" }}>{" → "}</span>
      <div
        style={{
          justifyContent: "center",
          fontSize: "16px",
          padding: "6px 10px",
          display: "flex",
          alignItems: "center",
          flex: "1",
        }}
      >
        <ChainIcon style={{ marginRight: 5, fill: "#001732" }} chainName={to} />
        {to}
      </div>
    </div>
  );
};
