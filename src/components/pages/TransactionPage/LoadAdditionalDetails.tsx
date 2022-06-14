import { Gateway, GatewayTransaction } from "@renproject/ren";
import React, { useCallback, useEffect, useState } from "react";

import { UIContainer } from "../../../containers/UIContainer";
import { NETWORK } from "../../../environmentVariables";
import { getGatewayInstance } from "../../../lib/searchGateway";
// import { getLegacyTransactionDepositInstance } from "../../../lib/searchLegacyTransaction";
import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { getTransactionDepositInstance } from "../../../lib/searchTransaction";
import { Spinner } from "../../Spinner";

interface Props {
    legacy: boolean;
    gateway: boolean;
    queryTx: SummarizedTransaction;

    deposit: Gateway | GatewayTransaction | Error | null | undefined;
    setDeposit?(deposit: GatewayTransaction | Error | null | undefined): void;
    setLockAndMint?(deposit: Gateway | Error | null | undefined): void;
}

export const LoadAdditionalDetails: React.FC<Props> = ({
    legacy,
    gateway,
    queryTx,
    deposit,
    setDeposit,
    setLockAndMint,
}) => {
    const { renJS } = UIContainer.useContainer();
    const [fetchingDeposit, setFetchingDeposit] = useState(false);

    const fetchDepositInstance = useCallback(async () => {
        setFetchingDeposit(true);
        if (
            queryTx &&
            !(queryTx instanceof Error) &&
            queryTx.transactionType === TransactionType.Mint
        ) {
            if (gateway && setLockAndMint && !setDeposit) {
                throw new Error("Not implemented.");
                // setLockAndMint(undefined);
                // try {
                //     const deposit = await getGatewayInstance(
                //         queryTx.result,
                //         NETWORK,
                //         queryTx.summary,
                //     );
                //     setLockAndMint(deposit);
                // } catch (error: any) {
                //     console.error(error);
                //     setLockAndMint(
                //         error instanceof Error ? error : new Error(error),
                //     );
                // }
            } else if (setDeposit && setLockAndMint) {
                setDeposit(undefined);
                try {
                    if (legacy) {
                        throw new Error("Not implemented.");
                        // const { deposit, lockAndMint } =
                        //   await getLegacyTransactionDepositInstance(
                        //     queryTx.result,
                        //     NETWORK,
                        //     queryTx.summary
                        //   );
                        // setDeposit(deposit);
                        // setLockAndMint(lockAndMint);
                    } else {
                        const { deposit, gateway } =
                            await getTransactionDepositInstance(
                                renJS,
                                queryTx.result,
                                NETWORK,
                                queryTx.summary,
                            );
                        setDeposit(deposit);
                        setLockAndMint(gateway);
                    }
                } catch (error: any) {
                    console.error(error);
                    setDeposit(
                        error instanceof Error ? error : new Error(error),
                    );
                }
            }
        }
        setFetchingDeposit(false);
    }, [renJS, queryTx, setDeposit, legacy, gateway, setLockAndMint]);

    useEffect(() => {
        fetchDepositInstance();
    }, []);

    return (
        <>
            {deposit && deposit instanceof Error ? (
                <div className="flex items-center">
                    <p>Error fetching transaction status</p>
                    {deposit.message ? (
                        <>
                            {":"}
                            <p className="ml-1 text-red-600">
                                {deposit.message}
                            </p>
                        </>
                    ) : (
                        "."
                    )}
                    <button
                        disabled={fetchingDeposit}
                        onClick={fetchDepositInstance}
                        className="ml-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:w-auto sm:text-sm"
                    >
                        Retry
                    </button>
                </div>
            ) : deposit === null ? (
                <>Unable to fetch transaction status</>
            ) : null}

            {queryTx.transactionType === TransactionType.Mint && !deposit ? (
                <>
                    <button
                        disabled={fetchingDeposit}
                        onClick={fetchDepositInstance}
                        className="whitespace-nowrap inline-flex items-center justify-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-small text-black bg-gray-200 hover:bg-gray-300"
                    >
                        {fetchingDeposit ? (
                            <>
                                <>Loading transaction status</>
                                <Spinner className="ml-2" />
                            </>
                        ) : (
                            <>Load transaction status</>
                        )}
                    </button>
                </>
            ) : null}
        </>
    );
};
