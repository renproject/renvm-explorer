import { InformationCircleIcon } from "@heroicons/react/outline";
import { Chain, TxStatus } from "@renproject/utils";
import BigNumber from "bignumber.js";
import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { classNames } from "../../../lib/utils";
import { AsyncButton } from "../../../packages/ChainTxSubmitter/components/AsyncButton";
import { AmountWithPrice } from "../../common/AmountWithPrice";
import { ExternalLink } from "../../common/ExternalLink";
import { Icon } from "../../common/icons/Icon";
import { Tooltip } from "../../common/Tooltip";
import { TransactionDiagram } from "../../common/TransactionDiagram";
import { Spinner } from "../../Spinner";
import { RenderPayload } from "./RenderPayload";
import { RenderRenVMStatus } from "./RenderRenVMStatus";

export const TableRow: React.FC<
    PropsWithChildren & {
        title: React.ReactNode;
        titleClassName?: string;
        className?: string;
    }
> = ({ title, titleClassName, children, className }) => (
    <div
        className={classNames(
            className,
            "py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6",
        )}
    >
        <dt
            className={classNames(
                "text-sm font-medium text-gray-500 flex items-start",
            )}
        >
            {title}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
            {children}
        </dd>
    </div>
);

export const TableHeader: React.FC<
    PropsWithChildren & { title: React.ReactNode }
> = ({ title, children }) => (
    <div className="flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 w-full py-5">
            <div className="">
                <h3 className="text-lg leading-6 font-medium text-gray-900 truncate flex">
                    {title}
                </h3>
            </div>
            {children}
        </div>
    </div>
);

interface Props {
    hash: string;
    error?: Error;
    loadAdditionalDetails?: () => Promise<void>;

    asset: string;
    from: string;
    to: string;
    toChain?: Chain;

    amount?: BigNumber;
    fee?: BigNumber;

    gatewayAddress?: string;
    toPayload?: { chain: string; txConfig?: any };

    status: TxStatus | undefined;
    inConfirmations?: number;
    inTarget?: number;

    revertReason: string | undefined;

    inTx?: { txHash: string; explorerLink: string };
    outTx?: { txHash: string; explorerLink: string };

    queryTx: SummarizedTransaction;

    handleRenVMTx?: () => Promise<void>;
    handleOutTx?: () => Promise<void>;
}

export const LoadingTransaction = ({
    hash,
    error,
}: {
    hash: string;
    error?: Error;
}) => {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
                <TableHeader
                    title={
                        <>
                            <div className="hidden sm:inline select-none">
                                Transaction
                            </div>
                            <div className="inline sm:hidden select-none">
                                Tx
                            </div>
                            <div className="ml-1.5 truncate">{hash}</div>
                        </>
                    }
                ></TableHeader>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200 flex items-center justify-center px-2 py-4">
                                {error ? (
                                    <div>{error.message}</div>
                                ) : (
                                    <Spinner />
                                )}
                            </dl>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export const CrossChainTransaction = ({
    hash,
    asset,
    from,
    to,
    amount,
    fee,
    gatewayAddress,
    toPayload,
    toChain,
    status,
    inConfirmations,
    inTarget,
    revertReason,
    inTx,
    outTx,
    queryTx,
    handleOutTx,
    handleRenVMTx,
    loadAdditionalDetails,
    error,
}: Props) => {
    return (
        <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
                <TableHeader
                    title={
                        <>
                            <div className="hidden sm:inline select-none">
                                Transaction
                            </div>
                            <div className="inline sm:hidden select-none">
                                Tx
                            </div>
                            <div className="ml-1.5 truncate">{hash}</div>
                        </>
                    }
                >
                    <div className="flex flex-row items-center mt-4 lg:mt-0">
                        <TransactionDiagram
                            asset={asset}
                            to={to}
                            from={from}
                            amount={amount}
                        />
                    </div>
                </TableHeader>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <>
                            <TableRow title={<>Asset</>}>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        flex: "1",
                                    }}
                                >
                                    <Icon
                                        style={{ marginRight: 5 }}
                                        chainName={asset}
                                    />
                                    {asset}
                                </div>
                            </TableRow>
                            <TableRow title={<>From</>}>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        flex: "1",
                                    }}
                                >
                                    <Icon
                                        style={{ marginRight: 5 }}
                                        chainName={from}
                                    />
                                    {from}
                                </div>
                            </TableRow>
                            <TableRow title={<>To</>}>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        flex: "1",
                                    }}
                                >
                                    <Icon
                                        style={{ marginRight: 5 }}
                                        chainName={to}
                                    />
                                    {to}
                                </div>
                            </TableRow>
                            {amount || queryTx.result?.in?.amount ? (
                                <TableRow title={<>Amount</>}>
                                    {amount ? (
                                        <AmountWithPrice
                                            amount={amount}
                                            asset={asset}
                                        />
                                    ) : (
                                        <>
                                            {queryTx.result.in.amount.toString()}{" "}
                                            (unknown decimals)
                                        </>
                                    )}
                                </TableRow>
                            ) : null}
                            {fee ? (
                                <TableRow title={<>{asset} Fee </>}>
                                    <AmountWithPrice
                                        amount={fee}
                                        asset={asset}
                                    />
                                </TableRow>
                            ) : null}
                            {status ? (
                                <TableRow title={<>RenVM Status</>}>
                                    <RenderRenVMStatus
                                        status={status}
                                        inConfirmations={inConfirmations}
                                        inTarget={inTarget}
                                        transactionType={TransactionType.Mint}
                                        revertReason={revertReason}
                                        handleRenVMTx={handleRenVMTx}
                                    />
                                </TableRow>
                            ) : null}
                            {gatewayAddress ? (
                                <TableRow title={<>Gateway Address</>}>
                                    <Link
                                        to={`/gateway/${gatewayAddress}`}
                                        style={{
                                            textDecoration: "underline",
                                        }}
                                    >
                                        {gatewayAddress}
                                    </Link>
                                </TableRow>
                            ) : null}
                            {toPayload && toChain ? (
                                <TableRow
                                    title="Recipient"
                                    titleClassName="items-start"
                                >
                                    <RenderPayload
                                        chain={toChain}
                                        payload={toPayload}
                                    />
                                </TableRow>
                            ) : null}
                            {inTx ? (
                                <TableRow title={<>{from} Transaction</>}>
                                    {inTx.txHash ? (
                                        <ExternalLink href={inTx.explorerLink}>
                                            {inTx.txHash}
                                        </ExternalLink>
                                    ) : (
                                        <>Submitted</>
                                    )}
                                </TableRow>
                            ) : null}
                            {outTx || handleOutTx ? (
                                <TableRow title={<>{to} Transaction</>}>
                                    {outTx?.txHash ? (
                                        <ExternalLink href={outTx.explorerLink}>
                                            {outTx.txHash}
                                        </ExternalLink>
                                    ) : handleOutTx ? (
                                        <button
                                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                                            onClick={handleOutTx}
                                        >
                                            Submit
                                        </button>
                                    ) : (
                                        <>
                                            Submitted{" "}
                                            <Tooltip
                                                tooltip={
                                                    "The transaction has been submitted but the transaction hash could not be looked up."
                                                }
                                            >
                                                <InformationCircleIcon className="w-4 -mt-0.5 inline" />
                                            </Tooltip>
                                        </>
                                    )}
                                </TableRow>
                            ) : null}
                            {loadAdditionalDetails ? (
                                <div className="py-4 sm:py-5 sm:grid sm:px-6">
                                    <AsyncButton
                                        className="w-fit"
                                        callOnMount={true}
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
                        </>
                    </dl>
                </div>
            </div>
        </div>
    );
};
