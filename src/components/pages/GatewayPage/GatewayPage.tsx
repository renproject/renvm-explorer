import {
  TransactionPageContainer,
  TransactionPageTitle,
  TransactionSpinner,
} from "../TransactionPage/TransactionPageStyles";
import { Card, Spinner, Table } from "react-bootstrap";
import { UIContainer } from "../../../containers/UIContainer";
import React, { useCallback, useEffect, useState } from "react";
import {
  LockAndMint,
  LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";
import { useRouteMatch } from "react-router-dom";
import { FromTransactionRow } from "../TransactionPage/rows/FromTransactionRow";
import { RecipientRow } from "../TransactionPage/rows/RecipientRow";
import { GatewayAddressRow } from "../TransactionPage/rows/GatewayAddressRow";
import { AmountRows } from "../TransactionPage/rows/AmountRows";
import { TransactionDiagram } from "../TransactionPage/TransactionDiagram";
import { LoadAdditionalDetails } from "../TransactionPage/LoadAdditionalDetails";
import { TransactionError } from "../TransactionPage/TransactionError";
import { SearchForDepositsToGateway } from "../TransactionPage/SearchForDepositsToGateway";

export const GatewayPage = () => {
  const { gateway, handleGatewayURL } = UIContainer.useContainer();

  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();

  useEffect(() => {
    handleGatewayURL(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const queryGateway =
    gateway && !(gateway instanceof Error) && gateway.queryGateway;

  const [lockAndMint, setLockAndMint] =
    useState<LockAndMint | Error | null | undefined>(undefined);

  const lockAndMintInstance =
    lockAndMint ||
    (gateway && !(gateway instanceof Error) && gateway.lockAndMint) ||
    undefined;

  return (
    <TransactionPageContainer>
      {gateway instanceof Error ? (
        <>Error</>
      ) : gateway ? (
        <>
          <TransactionPageTitle>
            <span>Gateway</span>
            <span style={{ overflow: "ellipsis`" }}>{gateway.address}</span>
          </TransactionPageTitle>

          <Card>
            <Card.Body>
              {queryGateway ? (
                queryGateway instanceof Error ? (
                  <TransactionError
                    txHash={gateway.address}
                    error={queryGateway}
                  />
                ) : (
                  <>
                    <TransactionDiagram queryTx={queryGateway} />

                    <Table>
                      <tbody>
                        <tr>
                          <td>Gateway Address</td>
                          <td>{gateway.address}</td>
                        </tr>
                        <RecipientRow
                          queryTx={queryGateway}
                          deposit={lockAndMintInstance}
                          legacy={false}
                        />
                      </tbody>
                    </Table>

                    <LoadAdditionalDetails
                      legacy={false}
                      gateway={true}
                      queryTx={queryGateway}
                      deposit={lockAndMintInstance}
                      setLockAndMint={setLockAndMint}
                    />
                    <SearchForDepositsToGateway
                      lockAndMint={lockAndMintInstance}
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
