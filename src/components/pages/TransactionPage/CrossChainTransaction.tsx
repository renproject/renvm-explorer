import { GatewayTransaction } from "@renproject/ren";
import {
    ChainTransactionStatus,
    TxStatus,
    TxSubmitter,
    TxWaiter,
} from "@renproject/utils";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";

import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { AsyncButton } from "../../../packages/ChainTxSubmitter/components/AsyncButton";
import { ChainIcon } from "../../common/ChainIcon";
import { ErrorBoundary } from "../../common/ErrorBoundary";
import { ExternalLink } from "../../common/ExternalLink";
import { Spinner } from "../../Spinner";
import { AmountWithPrice } from "./AmountWithPrice";
import { RenderRenVMStatus } from "./rows/StatusRow";
import { TransactionDiagram } from "./TransactionDiagram";

interface Props {
    hash: string;
    error?: Error;
    loadAdditionalDetails: () => Promise<void>;

    details?: {
        asset: string;
        from: string;
        to: string;

        amount?: BigNumber;
        fee?: BigNumber;

        gatewayAddress?: string;

        status: TxStatus | undefined;
        revertReason: string | undefined;

        inTx?: TxWaiter | TxSubmitter;
        renVMTx?: TxWaiter | TxSubmitter;
        outTx?: TxWaiter | TxSubmitter;

        queryTx: SummarizedTransaction;
        deposit: GatewayTransaction | Error | null | undefined;

        handleOutTx?: () => Promise<void>;
    };
}

export const CrossChainTransaction = ({
    hash,
    details,
    loadAdditionalDetails,
    error,
}: Props) => {
    if (!details) {
        return (
            <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
                    <ErrorBoundary>
                        <div className="flex flex-col">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 w-full py-5">
                                <div className="">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        <span className="truncate">
                                            Transaction {hash}
                                        </span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200 flex items-center justify-center px-2 py-4">
                                {error ? (
                                    <div>{error.message}</div>
                                ) : (
                                    <Spinner />
                                )}
                            </dl>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        );
    }

    const {
        asset,
        from,
        to,
        amount,
        fee,
        gatewayAddress,
        status,
        revertReason,
        inTx,
        renVMTx,
        outTx,
        queryTx,
        deposit,
        handleOutTx,
    } = details;

    return (
        <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
                <ErrorBoundary>
                    <div className="flex flex-col">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 w-full py-5">
                            <div className="">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    <span className="truncate">
                                        Transaction {hash}
                                    </span>
                                </h3>
                            </div>
                            <div className="flex flex-row items-center mt-4 lg:mt-0">
                                <TransactionDiagram
                                    asset={asset}
                                    to={to}
                                    from={from}
                                    amount={amount}
                                />
                                {/* <div className="ml-4">
                                        <CogIcon className="h-5 text-gray-500" />
                                    </div> */}
                            </div>
                        </div>
                        {/* <div className="px-4 pb-5">
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Personal details and application.
                        </p>
                    </div> */}
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Asset
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            flex: "1",
                                        }}
                                    >
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={asset}
                                        />
                                        {asset}
                                    </div>
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    From
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            flex: "1",
                                        }}
                                    >
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={from}
                                        />
                                        {from}
                                    </div>
                                </dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    To
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                    <div
                                        style={{
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            flex: "1",
                                        }}
                                    >
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={to}
                                        />
                                        {to}
                                    </div>
                                </dd>
                            </div>
                            {amount ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        <AmountWithPrice
                                            amount={amount}
                                            asset={asset}
                                        />
                                    </dd>
                                </div>
                            ) : queryTx.result?.in?.amount ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Amount
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-3 truncate">
                                        {queryTx.result.in.amount.toString()}{" "}
                                        (unknown decimals)
                                    </dd>
                                </div>
                            ) : null}
                            {fee ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        {asset} Fee{" "}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        <AmountWithPrice
                                            amount={fee}
                                            asset={asset}
                                        />
                                    </dd>
                                </div>
                            ) : null}
                            {status ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        RenVM Status
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        <>
                                            <RenderRenVMStatus
                                                status={status}
                                                transactionType={
                                                    TransactionType.Mint
                                                }
                                            />
                                            {/* <StatusRow
                                                    queryTx={queryTx}
                                                    deposit={deposit}
                                                />
                                                <LoadAdditionalDetails
                                                    legacy={false}
                                                    gateway={false}
                                                    queryTx={queryTx}
                                                    deposit={deposit}
                                                    setDeposit={setDeposit}
                                                    setLockAndMint={
                                                        setLockAndMint
                                                    }
                                                /> */}
                                        </>
                                    </dd>
                                </div>
                            ) : null}
                            {gatewayAddress ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Gateway Address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        <Link
                                            to={`/gateway/${gatewayAddress}`}
                                            style={{
                                                textDecoration: "underline",
                                            }}
                                        >
                                            {gatewayAddress}
                                        </Link>
                                    </dd>
                                </div>
                            ) : null}
                            {inTx ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        {from} Transaction
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        {inTx.progress.transaction ? (
                                            <ExternalLink
                                                href={
                                                    inTx.progress.transaction
                                                        .explorerLink
                                                }
                                            >
                                                {
                                                    inTx.progress.transaction
                                                        .txHash
                                                }
                                            </ExternalLink>
                                        ) : null}
                                    </dd>
                                </div>
                            ) : null}
                            {outTx && status === TxStatus.TxStatusDone ? (
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                                        <span>{to} Transaction</span>
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
                                        {outTx.progress.transaction ? (
                                            <ExternalLink
                                                href={
                                                    outTx.progress.transaction
                                                        .explorerLink
                                                }
                                            >
                                                {
                                                    outTx.progress.transaction
                                                        .txHash
                                                }
                                            </ExternalLink>
                                        ) : (
                                            <>
                                                {outTx.progress.status ===
                                                ChainTransactionStatus.Ready ? (
                                                    <button
                                                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                                                        onClick={handleOutTx}
                                                    >
                                                        Submit
                                                    </button>
                                                ) : null}
                                            </>
                                        )}
                                    </dd>
                                </div>
                            ) : null}
                            {!renVMTx ? (
                                <div className="py-4 sm:py-5 sm:grid sm:px-6">
                                    <AsyncButton
                                        className="w-fit"
                                        callOnMount={!!details}
                                        onClick={loadAdditionalDetails}
                                        allowOnlyOnce={true}
                                    >
                                        {(calling) => (
                                            <>
                                                {calling ? "Loading" : "Load"}{" "}
                                                additional details
                                            </>
                                        )}
                                    </AsyncButton>
                                </div>
                            ) : null}
                        </dl>
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
};
