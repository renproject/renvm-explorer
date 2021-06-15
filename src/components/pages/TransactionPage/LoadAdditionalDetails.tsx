import { Spinner, Button } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import { LockAndMintDeposit } from "@renproject/ren/build/main/lockAndMint";
import { NETWORK } from "../../../environmentVariables";
import { getTransactionDepositInstance } from "../../../lib/searchTransaction";
import { getLegacyTransactionDepositInstance } from "../../../lib/searchLegacyTransaction";
import {
  BurnAndReleaseTransaction,
  LockAndMintTransaction,
} from "@renproject/interfaces";
import { TransactionSummary } from "../../../lib/searchResult";

interface Props {
  legacy: boolean;
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

  deposit: LockAndMintDeposit | Error | null | undefined;
  setDeposit(deposit: LockAndMintDeposit | Error | null | undefined): void;
}

export const LoadAdditionalDetails: React.FC<Props> = ({
  legacy,
  queryTx,
  deposit,
  setDeposit,
}) => {
  const [fetchingDeposit, setFetchingDeposit] = useState(false);

  const fetchDepositInstance = useCallback(async () => {
    setDeposit(undefined);
    setFetchingDeposit(true);
    if (queryTx && !(queryTx instanceof Error) && queryTx.isMint) {
      try {
        if (legacy) {
          const deposit = await getLegacyTransactionDepositInstance(
            queryTx.result,
            NETWORK,
            queryTx.summary
          );
          setDeposit(deposit);
        } else {
          const deposit = await getTransactionDepositInstance(
            queryTx.result,
            NETWORK,
            queryTx.summary
          );
          setDeposit(deposit);
        }
      } catch (error) {
        setDeposit(error instanceof Error ? error : new Error(error));
      }
    }
    setFetchingDeposit(false);
  }, [queryTx, setDeposit]);

  return (
    <>
      {deposit && deposit instanceof Error ? (
        <>
          Error fetching additional transaction details{" "}
          <Button
            disabled={fetchingDeposit}
            variant="outline-success"
            onClick={fetchDepositInstance}
          >
            Retry
          </Button>
          <details>
            <summary>Show error details</summary>
            {deposit.message}
          </details>
        </>
      ) : deposit === null ? (
        <>Unable to fetch additional transaction details</>
      ) : null}

      {queryTx.isMint && !deposit ? (
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
