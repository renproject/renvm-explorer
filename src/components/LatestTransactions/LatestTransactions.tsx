import { RefreshIcon } from "@heroicons/react/outline";
import React, { useCallback, useEffect, useState } from "react";

import { LatestTransactionsContainer } from "../../containers/LatestTransactionsContainer";
import { Spinner } from "../Spinner";
import { TransactionPreview } from "./TransactionPreview";

export const LatestTransactions = ({ title }: { title: string }) => {
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
        [fetchLatestTransactions],
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
        <div className="w-full">
            <div className="align-middle inline-block w-full">
                <div className="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
                    <div className="flex justify-between bg-gray-50 p-3 border-b-2 border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500 uppercase">
                            {title}
                        </h3>
                        <div className="text-sm font-medium text-gray-500 uppercase">
                            {refreshed ? (
                                <span style={{ color: "#97b85d" }}>
                                    Refreshed
                                </span>
                            ) : (
                                <span
                                    className="cursor-pointer"
                                    onClick={() => refresh()}
                                >
                                    <RefreshIcon
                                        className={`h-5 text-gray-500 font-thin ${
                                            fetching ? "animate-spin" : ""
                                        }`}
                                    />
                                </span>
                            )}
                        </div>
                    </div>
                    <table
                        className="min-w-full divide-y divide-gray-200"
                        style={{ tableLayout: "fixed" }}
                    >
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Hash
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                                >
                                    From
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Asset
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-middle text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                                >
                                    Chains
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
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
                            {!latestTransactions && fetching ? (
                                <tr>
                                    <td colSpan={4} className=" col-span-4">
                                        <div className="w-full p-4 flex items-center justify-center">
                                            <Spinner />
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                            {fetchingError ? (
                                <tr>
                                    <td colSpan={4} className=" col-span-4">
                                        <div className="w-full p-4 flex items-center justify-center">
                                            Error fetching transactions: (
                                            {String(
                                                fetchingError.message ||
                                                    fetchingError,
                                            )}
                                            )
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
