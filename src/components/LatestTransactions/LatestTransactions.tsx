import React, { useCallback, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

import { LatestTransactionsContainer } from "../../containers/LatestTransactionsContainer";
import {
    LatestTransactionsInner,
    LatestTransactionsOuter,
    LatestTransactionsSubtitle,
    LatestTransactionsTitle,
} from "./LatestTransactionsStyles";
import { TransactionPreview } from "./TransactionPreview";

export const LatestTransactions = () => {
  const { latestTransactions, fetchLatestTransactions } =
    LatestTransactionsContainer.useContainer();

  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchingError, setFetchingError] = useState<Error | null>(null);
  const [refreshed, setRefreshed] = useState(false);

  const refresh = useCallback(
    async (first?: boolean) => {
      setFetching(true);
      setFetchingError(null);
      try {
        await fetchLatestTransactions();
        if (!first) {
          setRefreshed(true);
          setTimeout(() => setRefreshed(false), 3 * 1000);
        }
      } catch (error: any) {
        setFetchingError(error);
      }
      setFetching(false);
    },
    [fetchLatestTransactions]
  );

  useEffect(() => {
    if (!latestTransactions) {
      refresh(true).catch(console.error);
    }

    let internal = setInterval(() => {
      // Refresh every 60 seconds if the page is in focus.
      if (document.hasFocus()) {
        refresh().catch(console.error);
      }
    }, 60 * 1000);

    return () => clearInterval(internal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LatestTransactionsOuter>
      <Container>
        <LatestTransactionsInner>
          <LatestTransactionsTitle>Latest Transactions</LatestTransactionsTitle>
          <LatestTransactionsSubtitle>
            <div>The most recent RenVM transactions.</div>
            <div>
              {refreshed ? (
                <span style={{ color: "#97b85d" }}>Refreshed</span>
              ) : fetching ? (
                <span>Fetching...</span>
              ) : (
                <span onClick={() => refresh()}>Refresh</span>
              )}
            </div>
          </LatestTransactionsSubtitle>

          {!latestTransactions && fetching ? (
            <div
              style={{
                width: "100%",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner
                animation="border"
                role="status"
                variant="success"
                style={{ borderWidth: 1 }}
              ></Spinner>
            </div>
          ) : null}

          {latestTransactions?.map((tx) => {
            return tx ? (
              <TransactionPreview
                key={tx.result.hash}
                queryTx={tx}
                refreshed={refreshed}
              />
            ) : (
              <p>...</p>
            );
          })}
          {fetchingError ? (
            <p>
              Error fetching transactions (
              {String(fetchingError.message || fetchingError)})
            </p>
          ) : null}
        </LatestTransactionsInner>
      </Container>
    </LatestTransactionsOuter>
  );
};
