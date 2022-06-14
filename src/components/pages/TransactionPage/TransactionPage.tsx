import { Gateway, GatewayTransaction } from "@renproject/ren";
import { RenVMCrossChainTxSubmitter } from "@renproject/ren/build/main/renVMTxSubmitter";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { NETWORK } from "../../../environmentVariables";
import { getGatewayInstance } from "../../../lib/searchGateway";
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
                NETWORK,
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

    if (!hash) {
        return <div>No hash provided.</div>;
    }

    return (
        <>
            <CrossChainTransaction
                hash={hash}
                loadAdditionalDetails={
                    queryTx &&
                    !(queryTx instanceof Error) &&
                    queryTx.transactionType === TransactionType.Mint
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
                                      (transactionInstance &&
                                          !(
                                              transactionInstance instanceof
                                              Error
                                          ) &&
                                          transactionInstance.renVM) as
                                          | RenVMCrossChainTxSubmitter
                                          | undefined
                                  )?.progress?.response?.txStatus,
                              revertReason: (
                                  (transactionInstance &&
                                      !(transactionInstance instanceof Error) &&
                                      transactionInstance.renVM) as
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
                                  (gatewayInstance &&
                                      !(gatewayInstance instanceof Error) &&
                                      gatewayInstance.gatewayAddress) ||
                                  undefined,
                              inTx:
                                  (transactionInstance &&
                                      !(transactionInstance instanceof Error) &&
                                      transactionInstance.in) ||
                                  undefined,
                              renVMTx:
                                  (transactionInstance &&
                                      !(transactionInstance instanceof Error) &&
                                      transactionInstance.renVM) ||
                                  undefined,
                              outTx:
                                  (transactionInstance &&
                                      !(transactionInstance instanceof Error) &&
                                      transactionInstance.out) ||
                                  undefined,
                              queryTx,
                              handleOutTx,
                          }
                        : undefined
                }
            />
        </>
    );
};
