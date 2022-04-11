import React, { useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { RenVMCrossChainTransaction } from "@renproject/provider";
import { Gateway, GatewayTransaction } from "@renproject/ren";

import { UIContainer } from "../../../containers/UIContainer";
import {
  SearchResultType,
  SummarizedTransaction,
} from "../../../lib/searchResult";
import { LoadAdditionalDetails } from "./LoadAdditionalDetails";
import { AmountRows } from "./rows/AmountRows";
import { FromTransactionRow } from "./rows/FromTransactionRow";
import { GatewayAddressRow } from "./rows/GatewayAddressRow";
import { RecipientRow } from "./rows/RecipientRow";
import { StatusRow } from "./rows/StatusRow";
import { ToTransactionRow } from "./rows/ToTransactionRow";
import { TransactionDiagram } from "./TransactionDiagram";
import { TransactionError } from "./TransactionError";
import {
  TransactionPageContainer,
  TransactionPageTitle,
  TransactionSpinner,
} from "./TransactionPageStyles";

export const TransactionPage = () => {
  const { transaction, handleTransactionURL } = UIContainer.useContainer();

  const { hash, legacyHash } = useParams<
    | { hash: string; legacyHash: undefined }
    | { hash: undefined; legacyHash: string }
  >();

  useEffect(() => {
    if (hash) {
      handleTransactionURL(hash);
    } else {
      throw new Error(`Not implemented - legacy tx: ${legacyHash}`);
      // handleLegacyTransactionURL(legacyHash);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const queryTx: SummarizedTransaction | undefined =
    transaction && !(transaction instanceof Error) && transaction.queryTx
      ? (transaction.queryTx as SummarizedTransaction)
      : undefined;

  const [deposit, setDeposit] = useState<
    GatewayTransaction | Error | null | undefined
  >(undefined);
  const [lockAndMint, setLockAndMint] = useState<
    Gateway | Error | null | undefined
  >(undefined);

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
                          <td>
                            {
                              (queryTx.result as RenVMCrossChainTransaction)
                                .hash
                            }
                          </td>
                        </tr>
                        <tr>
                          <td>Selector</td>
                          <td>
                            {
                              (queryTx.result as RenVMCrossChainTransaction)
                                .selector
                            }
                          </td>
                        </tr>
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
                        {/* <TokenAccountRow queryTx={queryTx} deposit={deposit} /> */}
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
