import {
    ArrowCircleLeftIcon,
    ArrowCircleRightIcon,
    CheckCircleIcon,
    ChevronDoubleLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    RefreshIcon,
} from "@heroicons/react/outline";
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react";

import { LatestTransactionsContainer } from "../../containers/LatestTransactionsContainer";
import { classNames } from "../../lib/utils";
import { Spinner } from "../Spinner";
import { TransactionPreview } from "./TransactionPreview";

const AsyncIcon: React.FC<{
    icon: (props: React.ComponentProps<"svg">) => JSX.Element;
    onClick: () => Promise<void>;
    disabled?: boolean;
    className?: string;
    showSuccess?: boolean;
}> = ({ className, onClick, icon: Icon, disabled, showSuccess }) => {
    const [calling, setCalling] = useState(false);
    const [called, setCalled] = useState(false);
    const asyncOnClick = useCallback(async () => {
        setCalling(true);
        setCalled(false);
        try {
            await onClick();
            setCalled(true);
            setTimeout(() => setCalled(false), 1 * 1000);
        } catch (error) {
            // Ignore
        }
        setCalling(false);
    }, [onClick]);

    return calling ? (
        <RefreshIcon
            className={classNames(
                "h-4 px-0.5 text-gray-500 font-thin animate-spin",
                className,
            )}
        />
    ) : called && showSuccess ? (
        <CheckCircleIcon
            className={classNames("h-5 text-green-500 font-thin", className)}
        />
    ) : (
        <Icon
            role="button"
            className={classNames(
                "cursor-pointer h-5 text-gray-500 font-thin",
                disabled ? "opacity-50 cursor-default" : "",
                className,
            )}
            onClick={disabled ? undefined : asyncOnClick}
        />
    );
};

export const LatestTransactions = ({ title }: { title: string }) => {
    const { page, latestTransactions, fetchLatestTransactions } =
        LatestTransactionsContainer.useContainer();

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingError, setFetchingError] = useState<Error | null>(null);
    const [refreshed, setRefreshed] = useState(false);

    const refresh = useCallback(
        async (nextPage: number, manualCall?: boolean) => {
            setRefreshed(false);
            setFetching(true);
            setFetchingError(null);
            try {
                await fetchLatestTransactions(nextPage);
                if (!manualCall) {
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
            refresh(page).catch(console.error);
        }

        let internal = setInterval(() => {
            // Refresh every 60 seconds if the page is in focus.
            if (document.hasFocus()) {
                refresh(page).catch(console.error);
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
                        <div className="flex items-center text-xs font-medium text-gray-500 uppercase">
                            <AsyncIcon
                                icon={ChevronDoubleLeftIcon}
                                onClick={() => refresh(0, true)}
                                disabled={fetching || page === 0}
                            />
                            <AsyncIcon
                                icon={ChevronLeftIcon}
                                onClick={() => refresh(page - 1, true)}
                                disabled={fetching || page === 0}
                            />
                            <span className="px-1">
                                Page <span className="font-mono">{page}</span>
                            </span>
                            <AsyncIcon
                                icon={ChevronRightIcon}
                                onClick={() => refresh(page + 1, true)}
                                disabled={fetching}
                            />
                            <AsyncIcon
                                icon={RefreshIcon}
                                onClick={() => refresh(page)}
                                disabled={fetching}
                                showSuccess={true}
                            />
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
                            {latestTransactions?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className=" col-span-4">
                                        <div className="w-full p-4 flex items-center justify-center">
                                            No transactions.
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
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
