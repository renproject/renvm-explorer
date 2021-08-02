import { Spinner, Button } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import {
  LockAndMint,
  LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";
import { NETWORK } from "../../../environmentVariables";
import { getTransactionDepositInstance } from "../../../lib/searchTransaction";
import { getLegacyTransactionDepositInstance } from "../../../lib/searchLegacyTransaction";
import {
  SummarizedTransaction,
  TransactionType,
} from "../../../lib/searchResult";
import { getGatewayInstance } from "../../../lib/searchGateway";

interface Props {
  legacy: boolean;
  gateway: boolean;
  queryTx: SummarizedTransaction;

  deposit: LockAndMint | LockAndMintDeposit | Error | null | undefined;
  setDeposit?(deposit: LockAndMintDeposit | Error | null | undefined): void;
  setLockAndMint?(deposit: LockAndMint | Error | null | undefined): void;
}

export const LoadAdditionalDetails: React.FC<Props> = ({
  legacy,
  gateway,
  queryTx,
  deposit,
  setDeposit,
  setLockAndMint,
}) => {
  const [fetchingDeposit, setFetchingDeposit] = useState(false);

  const fetchDepositInstance = useCallback(async () => {
    setFetchingDeposit(true);
    if (
      queryTx &&
      !(queryTx instanceof Error) &&
      queryTx.transactionType === TransactionType.Mint
    ) {
      if (gateway && setLockAndMint && !setDeposit) {
        setLockAndMint(undefined);
        try {
          const deposit = await getGatewayInstance(
            queryTx.result,
            NETWORK,
            queryTx.summary
          );
          setLockAndMint(deposit);
        } catch (error) {
          console.error(error);
          setLockAndMint(error instanceof Error ? error : new Error(error));
        }
      } else if (setDeposit && setLockAndMint) {
        setDeposit(undefined);
        try {
          if (legacy) {
            const { deposit, lockAndMint } =
              await getLegacyTransactionDepositInstance(
                queryTx.result,
                NETWORK,
                queryTx.summary
              );
            setDeposit(deposit);
            setLockAndMint(lockAndMint);
          } else {
            const { deposit, lockAndMint } =
              await getTransactionDepositInstance(
                queryTx.result,
                NETWORK,
                queryTx.summary
              );
            setDeposit(deposit);
            setLockAndMint(lockAndMint);
          }
        } catch (error) {
          console.error(error);
          setDeposit(error instanceof Error ? error : new Error(error));
        }
      }
    }
    setFetchingDeposit(false);
  }, [queryTx, setDeposit, legacy, gateway, setLockAndMint]);

  return (
    <>
      {deposit && deposit instanceof Error ? (
        <>
          <p>Error fetching additional transaction details</p>
          {deposit.message ? (
            <p style={{ color: "red" }}>{deposit.message}</p>
          ) : null}
          <Button
            disabled={fetchingDeposit}
            variant="outline-success"
            onClick={fetchDepositInstance}
          >
            Retry
          </Button>
        </>
      ) : deposit === null ? (
        <>Unable to fetch additional transaction details</>
      ) : null}

      {queryTx.transactionType === TransactionType.Mint && !deposit ? (
        <>
          <Button
            disabled={fetchingDeposit}
            variant="outline-success"
            onClick={fetchDepositInstance}
            style={{ marginLeft: 10 }}
          >
            {fetchingDeposit ? (
              <>
                <>Loading additional details</>
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  variant="success"
                  style={{
                    borderWidth: 1,
                    marginLeft: 5,
                  }}
                ></Spinner>
              </>
            ) : (
              <>Load additional details</>
            )}
          </Button>
        </>
      ) : null}
    </>
  );
};
