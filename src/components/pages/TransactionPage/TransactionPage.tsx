import {
  TransactionPageContainer,
  TransactionPageTitle,
  TransactionSpinner,
} from "./TransactionPageStyles";
import { Card, Spinner, Table } from "react-bootstrap";
import { UIContainer } from "../../../containers/UIContainer";
import React, { useEffect, useState } from "react";
import {
  LockAndMint,
  LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";
import { useRouteMatch } from "react-router-dom";
import { FromTransactionRow } from "./rows/FromTransactionRow";
import { RecipientRow } from "./rows/RecipientRow";
import { StatusRow } from "./rows/StatusRow";
import { GatewayAddressRow } from "./rows/GatewayAddressRow";
import { ToTransactionRow } from "./rows/ToTransactionRow";
import { AmountRows } from "./rows/AmountRows";
import { TransactionDiagram } from "./TransactionDiagram";
import { LoadAdditionalDetails } from "./LoadAdditionalDetails";
import { TransactionError } from "./TransactionError";
import { SearchResultType } from "../../../lib/searchResult";

export const TransactionPage = () => {
  const { transaction, handleTransactionURL, handleLegacyTransactionURL } =
    UIContainer.useContainer();

  const {
    params: { hash, legacyHash },
  } =
    useRouteMatch<
      | { hash: string; legacyHash: undefined }
      | { hash: undefined; legacyHash: string }
    >();

  useEffect(() => {
    if (hash) {
      handleTransactionURL(hash);
    } else {
      handleLegacyTransactionURL(legacyHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const queryTx =
    transaction && !(transaction instanceof Error) && transaction.queryTx;

  const [deposit, setDeposit] =
    useState<LockAndMintDeposit | Error | null | undefined>(undefined);
  const [lockAndMint, setLockAndMint] =
    useState<LockAndMint | Error | null | undefined>(undefined);

  return (
    <TransactionPageContainer>
      {transaction instanceof Error ? (
        <>Error</>
      ) : transaction ? (
        <>
          <TransactionPageTitle>
            <span>Transaction</span>
            <span style={{ overflow: "ellipsis`" }}>{transaction.txHash}</span>
          </TransactionPageTitle>

          <Card>
            <Card.Body>
              {queryTx ? (
                queryTx instanceof Error ? (
                  <TransactionError
                    txHash={transaction.txHash}
                    error={queryTx}
                  />
                ) : (
                  <>
                    <TransactionDiagram queryTx={queryTx} />

                    <Table>
                      <tbody>
                        <tr>
                          <td>RenVM Hash</td>
                          <td>{queryTx.result.hash}</td>
                        </tr>
                        {/* <tr>
                          <td>Selector</td>
                          <td>{queryTx.result.to}</td>
                        </tr> */}
                        <GatewayAddressRow
                          lockAndMint={lockAndMint}
                          queryTx={queryTx}
                        />
                        <FromTransactionRow queryTx={queryTx} />
                        <ToTransactionRow queryTx={queryTx} deposit={deposit} />
                        <AmountRows queryTx={queryTx} />
                        <RecipientRow
                          queryTx={queryTx}
                          deposit={deposit}
                          legacy={
                            transaction.type ===
                            SearchResultType.LegacyRenVMTransaction
                          }
                        />
                        <StatusRow queryTx={queryTx} deposit={deposit} />
                      </tbody>
                    </Table>

                    <LoadAdditionalDetails
                      legacy={
                        transaction.type ===
                        SearchResultType.LegacyRenVMTransaction
                      }
                      gateway={false}
                      queryTx={queryTx}
                      deposit={deposit}
                      setDeposit={setDeposit}
                      setLockAndMint={setLockAndMint}
                    />
                  </>
                )
              ) : (
                <TransactionSpinner>
                  <Spinner
                    animation="border"
                    role="status"
                    variant="success"
                  ></Spinner>
                </TransactionSpinner>
              )}
            </Card.Body>
          </Card>
        </>
      ) : null}
    </TransactionPageContainer>
  );
};
