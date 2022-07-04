import { Gateway, GatewayTransaction } from "@renproject/ren";
import { RenVMCrossChainTxSubmitter } from "@renproject/ren//renVMTxSubmitter";
import { ChainTransactionStatus, TxStatus, utils } from "@renproject/utils";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { getTransactionDepositInstance } from "../../../lib/searchTransaction";
import { ChainTxSubmitter } from "../../../packages/ChainTxSubmitter";
import {
    CrossChainTransaction,
    LoadingTransaction,
} from "./CrossChainTransaction";

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

    const [transactionInstance, setTransactionInstance] = useState<
        GatewayTransaction | Error | null | undefined
    >(undefined);
    const [gatewayInstance, setGatewayInstance] = useState<
        Gateway | Error | null | undefined
    >(undefined);

    const { renJS } = UIContainer.useContainer();

    const loadAdditionalDetails = useCallback(async () => {
        if (
            queryTx &&
            !(queryTx instanceof Error) &&
            queryTx.transactionType === TransactionType.Mint
        ) {
            setTransactionInstance(undefined);
            const { deposit, gateway } = await getTransactionDepositInstance(
                renJS,
                queryTx.result,
                queryTx.summary,
            );
            setTransactionInstance(deposit);
            setGatewayInstance(gateway);
        }
    }, [renJS, queryTx, setTransactionInstance, setGatewayInstance]);

    const handleOutTx = useCallback(async () => {
        if (!transactionInstance || transactionInstance instanceof Error) {
            return;
        }

        handleChainTransaction(
            transactionInstance.out,
            transactionInstance.outSetup,
        );
    }, [transactionInstance, handleChainTransaction]);

    // Re-render when a progress event is emitted.
    const [, setToggle] = useState(false);

    const handleRenVMTx = useCallback(async () => {
        if (!transactionInstance || transactionInstance instanceof Error) {
            return;
        }

        transactionInstance.renVM.eventEmitter.on("progress", (progress) => {
            setToggle((t) => !t);
        });
        await transactionInstance.renVM.wait();
    }, [transactionInstance]);

    const [calledInWait, setCalledInWait] = useState(false);
    useEffect(() => {
        if (
            calledInWait ||
            !transactionInstance ||
            transactionInstance instanceof Error
        ) {
            return;
        }

        setCalledInWait(true);

        if (
            transactionInstance.in.progress.status !==
            ChainTransactionStatus.Done
        ) {
            transactionInstance.in.eventEmitter.on("progress", (progress) => {
                setToggle((t) => !t);
            });
            transactionInstance.in.wait().catch(console.error);
        }
    }, [calledInWait, transactionInstance]);

    if (!hash) {
        return <LoadingTransaction hash="not found" error={undefined} />;
    }

    if (!queryTx || !queryTx.summary) {
        return (
            <LoadingTransaction
                hash={hash}
                error={
                    transaction instanceof Error
                        ? transaction
                        : transaction?.queryTx instanceof Error
                        ? transaction.queryTx
                        : undefined
                }
            />
        );
    }

    const inTx:
        | {
              txHash: string;
              explorerLink: string;
          }
        | undefined =
        (transactionInstance &&
            !(transactionInstance instanceof Error) &&
            transactionInstance.in.progress.transaction) ||
        queryTx.summary.inTx ||
        undefined;

    const outTx:
        | {
              txHash: string;
              explorerLink: string;
          }
        | undefined =
        (transactionInstance &&
            !(transactionInstance instanceof Error) &&
            transactionInstance.out.progress.transaction) ||
        queryTx.summary.outTx ||
        undefined;

    return (
        <>
            <CrossChainTransaction
                hash={hash}
                loadAdditionalDetails={
                    queryTx &&
                    !(queryTx instanceof Error) &&
                    queryTx.transactionType === TransactionType.Mint &&
                    (!utils.isDefined(transactionInstance) ||
                        transactionInstance instanceof Error)
                        ? loadAdditionalDetails
                        : undefined
                }
                error={
                    transaction instanceof Error
                        ? transaction
                        : transaction?.queryTx instanceof Error
                        ? transaction.queryTx
                        : undefined
                }
                asset={queryTx.summary.asset}
                from={queryTx.summary.from}
                to={queryTx.summary.to}
                amount={queryTx.summary.amountIn}
                status={
                    queryTx.result.status ||
                    (
                        (transactionInstance &&
                            !(transactionInstance instanceof Error) &&
                            transactionInstance.renVM) as
                            | RenVMCrossChainTxSubmitter
                            | undefined
                    )?.progress?.response?.txStatus
                }
                inTarget={
                    transactionInstance &&
                    !(transactionInstance instanceof Error)
                        ? transactionInstance.in.progress.target
                        : undefined
                }
                inConfirmations={
                    transactionInstance &&
                    !(transactionInstance instanceof Error)
                        ? transactionInstance.in.progress.confirmations
                        : undefined
                }
                revertReason={
                    (
                        (transactionInstance &&
                            !(transactionInstance instanceof Error) &&
                            transactionInstance.renVM) as
                            | RenVMCrossChainTxSubmitter
                            | undefined
                    )?.progress?.revertReason
                }
                fee={
                    queryTx.summary.amountIn && queryTx.summary.amountOut
                        ? queryTx.summary.amountIn.minus(
                              queryTx.summary.amountOut,
                          )
                        : undefined
                }
                gatewayAddress={
                    (gatewayInstance &&
                        !(gatewayInstance instanceof Error) &&
                        gatewayInstance.gatewayAddress) ||
                    undefined
                }
                inTx={inTx}
                outTx={outTx}
                queryTx={queryTx}
                handleRenVMTx={
                    transactionInstance &&
                    !(transactionInstance instanceof Error) &&
                    transactionInstance.renVM.progress.status !==
                        ChainTransactionStatus.Done
                        ? handleRenVMTx
                        : undefined
                }
                handleOutTx={
                    transactionInstance &&
                    !(transactionInstance instanceof Error) &&
                    transactionInstance.renVM.progress.status ===
                        ChainTransactionStatus.Done &&
                    transactionInstance.out.progress.status ===
                        ChainTransactionStatus.Ready
                        ? handleOutTx
                        : undefined
                }
            />
        </>
    );
};
