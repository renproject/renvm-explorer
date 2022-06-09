import { Gateway, GatewayTransaction } from "@renproject/ren";
import { RenVMCrossChainTxSubmitter } from "@renproject/ren/build/main/renVMTxSubmitter";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { NETWORK } from "../../../environmentVariables";
import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { getTransactionDepositInstance } from "../../../lib/searchTransaction";
import { ChainTxSubmitter } from "../../../packages/ChainTxSubmitter";
import { CrossChainTransaction } from "./CrossChainTransaction";

export const TransactionPage = () => {
    const { transaction, handleTransactionURL } = UIContainer.useContainer();
    const { handleChainTransaction } = ChainTxSubmitter.useContainer();

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
        transaction &&
        !(transaction instanceof Error) &&
        transaction.queryTx &&
        transaction.txHash === hash
            ? (transaction.queryTx as SummarizedTransaction)
            : undefined;

    const [deposit, setDeposit] = useState<
        GatewayTransaction | Error | null | undefined
    >(undefined);
    const [lockAndMint, setLockAndMint] = useState<
        Gateway | Error | null | undefined
    >(undefined);

    const { renJS } = UIContainer.useContainer();

    const loadAdditionalDetails = useCallback(async () => {
        if (
            queryTx &&
            !(queryTx instanceof Error) &&
            queryTx.transactionType === TransactionType.Mint
        ) {
            if (deposit && !setDeposit) {
                // Gateway

                throw new Error("Not implemented.");
                // setLockAndMint(undefined);
                // try {
                //   const deposit = await getGatewayInstance(
                //     queryTx.result,
                //     NETWORK,
                //     queryTx.summary
                //   );
                //   setLockAndMint(deposit);
                // } catch (error: any) {
                //   console.error(error);
                //   setLockAndMint(error instanceof Error ? error : new Error(error));
                // }
            } else if (setDeposit) {
                setDeposit(undefined);
                const { deposit, gateway } =
                    await getTransactionDepositInstance(
                        renJS,
                        queryTx.result,
                        NETWORK,
                        queryTx.summary,
                    );
                setDeposit(deposit);
                setLockAndMint(gateway);

                // Legacy
                // const { deposit, lockAndMint } =
                //   await getLegacyTransactionDepositInstance(
                //     queryTx.result,
                //     NETWORK,
                //     queryTx.summary
                //   );
                // setDeposit(deposit);
                // setLockAndMint(lockAndMint);
            }
        }
    }, [renJS, queryTx, setDeposit, deposit, setLockAndMint]);

    const handleOutTx = useCallback(async () => {
        if (!deposit || deposit instanceof Error) {
            return;
        }

        handleChainTransaction(deposit.out, deposit.outSetup);
    }, [deposit, handleChainTransaction]);

    if (!hash) {
        return <div>No hash provided.</div>;
    }

    return (
        <>
            <CrossChainTransaction
                hash={hash}
                loadAdditionalDetails={loadAdditionalDetails}
                error={
                    transaction instanceof Error
                        ? transaction
                        : transaction?.queryTx instanceof Error
                        ? transaction.queryTx
                        : undefined
                }
                details={
                    queryTx && queryTx.summary
                        ? {
                              asset: queryTx.summary.asset,
                              from: queryTx.summary.from,
                              to: queryTx.summary.to,
                              amount: queryTx.summary.amountIn,
                              status:
                                  queryTx.result.status ||
                                  (
                                      (deposit &&
                                          !(deposit instanceof Error) &&
                                          deposit.renVM) as
                                          | RenVMCrossChainTxSubmitter
                                          | undefined
                                  )?.progress?.response?.txStatus,
                              revertReason: (
                                  (deposit &&
                                      !(deposit instanceof Error) &&
                                      deposit.renVM) as
                                      | RenVMCrossChainTxSubmitter
                                      | undefined
                              )?.progress?.revertReason,
                              fee:
                                  queryTx.summary.amountIn &&
                                  queryTx.summary.amountOut
                                      ? queryTx.summary.amountIn.minus(
                                            queryTx.summary.amountOut,
                                        )
                                      : undefined,
                              gatewayAddress:
                                  (lockAndMint &&
                                      !(lockAndMint instanceof Error) &&
                                      lockAndMint.gatewayAddress) ||
                                  undefined,
                              inTx:
                                  (deposit &&
                                      !(deposit instanceof Error) &&
                                      deposit.in) ||
                                  undefined,
                              renVMTx:
                                  (deposit &&
                                      !(deposit instanceof Error) &&
                                      deposit.renVM) ||
                                  undefined,
                              outTx:
                                  (deposit &&
                                      !(deposit instanceof Error) &&
                                      deposit.out) ||
                                  undefined,
                              queryTx,
                              deposit,

                              handleOutTx,
                          }
                        : undefined
                }
            />
        </>
    );
};
