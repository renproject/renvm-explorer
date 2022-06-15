import { TxStatus } from "@renproject/utils";
import BigNumber from "bignumber.js";
import React, { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import {
    SummarizedTransaction,
    TransactionType,
} from "../../../lib/searchResult";
import { AsyncButton } from "../../../packages/ChainTxSubmitter/components/AsyncButton";
import { AmountWithPrice } from "../../common/AmountWithPrice";
import { ChainIcon } from "../../common/ChainIcon";
import { ExternalLink } from "../../common/ExternalLink";
import { TransactionDiagram } from "../../common/TransactionDiagram";
import { Spinner } from "../../Spinner";
import { RenderRenVMStatus } from "./StatusRow";

export const TableRow: React.FC<
    PropsWithChildren & { title: React.ReactNode }
> = ({ title, children }) => (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">{title}</dt>
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

    details?: {
        asset: string;
        from: string;
        to: string;

        amount?: BigNumber;
        fee?: BigNumber;

        gatewayAddress?: string;

        status: TxStatus | undefined;
        revertReason: string | undefined;

        inTx?: { txHash: string; explorerLink: string };
        outTx?: { txHash: string; explorerLink: string };

        queryTx: SummarizedTransaction;

        handleOutTx?: () => Promise<void>;
    };
}

export const CrossChainTransaction = ({
    hash,
    details,
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
                    {details ? (
                        <div className="flex flex-row items-center mt-4 lg:mt-0">
                            <TransactionDiagram
                                asset={details.asset}
                                to={details.to}
                                from={details.from}
                                amount={details.amount}
                            />
                        </div>
                    ) : null}
                </TableHeader>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {details ? (
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
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={details.asset}
                                        />
                                        {details.asset}
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
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={details.from}
                                        />
                                        {details.from}
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
                                        <ChainIcon
                                            style={{ marginRight: 5 }}
                                            chainName={details.to}
                                        />
                                        {details.to}
                                    </div>
                                </TableRow>
                                {details.amount ||
                                details.queryTx.result?.in?.amount ? (
                                    <TableRow title={<>Amount</>}>
                                        {details.amount ? (
                                            <AmountWithPrice
                                                amount={details.amount}
                                                asset={details.asset}
                                            />
                                        ) : (
                                            <>
                                                {details.queryTx.result.in.amount.toString()}{" "}
                                                (unknown decimals)
                                            </>
                                        )}
                                    </TableRow>
                                ) : null}
                                {details.fee ? (
                                    <TableRow title={<>{details.asset} Fee </>}>
                                        <AmountWithPrice
                                            amount={details.fee}
                                            asset={details.asset}
                                        />
                                    </TableRow>
                                ) : null}
                                {details.status ? (
                                    <TableRow title={<>RenVM Status</>}>
                                        <RenderRenVMStatus
                                            status={details.status}
                                            transactionType={
                                                TransactionType.Mint
                                            }
                                            revertReason={details.revertReason}
                                        />
                                    </TableRow>
                                ) : null}
                                {details.gatewayAddress ? (
                                    <TableRow title={<>Gateway Address</>}>
                                        <Link
                                            to={`/gateway/${details.gatewayAddress}`}
                                            style={{
                                                textDecoration: "underline",
                                            }}
                                        >
                                            {details.gatewayAddress}
                                        </Link>
                                    </TableRow>
                                ) : null}
                                {details.inTx ? (
                                    <TableRow
                                        title={<>{details.from} Transaction</>}
                                    >
                                        <ExternalLink
                                            href={details.inTx.explorerLink}
                                        >
                                            {details.inTx.txHash}
                                        </ExternalLink>
                                    </TableRow>
                                ) : null}
                                {details.outTx || details.handleOutTx ? (
                                    <TableRow
                                        title={<>{details.to} Transaction</>}
                                    >
                                        {details.outTx ? (
                                            <ExternalLink
                                                href={
                                                    details.outTx.explorerLink
                                                }
                                            >
                                                {details.outTx.txHash}
                                            </ExternalLink>
                                        ) : details.handleOutTx ? (
                                            <button
                                                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                                                onClick={details.handleOutTx}
                                            >
                                                Submit
                                            </button>
                                        ) : null}
                                    </TableRow>
                                ) : null}
                                {loadAdditionalDetails ? (
                                    <div className="py-4 sm:py-5 sm:grid sm:px-6">
                                        <AsyncButton
                                            className="w-fit"
                                            callOnMount={!!details}
                                            onClick={loadAdditionalDetails}
                                            allowOnlyOnce={true}
                                        >
                                            {(calling) => (
                                                <>
                                                    {calling
                                                        ? "Loading"
                                                        : "Load"}{" "}
                                                    additional details
                                                </>
                                            )}
                                        </AsyncButton>
                                    </div>
                                ) : null}
                            </>
                        ) : (
                            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                <dl className="sm:divide-y sm:divide-gray-200 flex items-center justify-center px-2 py-4">
                                    {error ? (
                                        <div>{error.message}</div>
                                    ) : (
                                        <Spinner />
                                    )}
                                </dl>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    );
};
