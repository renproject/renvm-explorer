import { Gateway, GatewayTransaction } from "@renproject/ren";
import { Chain, utils } from "@renproject/utils";
import BigNumber from "bignumber.js";
import { Link } from "react-router-dom";

import { SummarizedTransaction } from "../../../lib/searchResult";
import { AsyncButton } from "../../../packages/ChainTxSubmitter/components/AsyncButton";
import { ExternalLink } from "../../common/ExternalLink";
import { Icon } from "../../common/icons/Icon";
import { TransactionDiagram } from "../../common/TransactionDiagram";
import { Spinner } from "../../Spinner";
import {
    TableHeader,
    TableRow,
} from "../TransactionPage/CrossChainTransaction";

interface Props {
    address: string;
    error?: Error;
    loadAdditionalDetails?: () => Promise<void>;

    details?: {
        asset: string;
        from: string;
        to: string;
        decimals?: number;

        queryGateway: SummarizedTransaction;
        gatewayInstance: Gateway | undefined;
        deposits: GatewayTransaction[];
        fromChain: Chain | undefined;
    };
}

export const GatewayTable = ({
    address,
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
                                Gateway
                            </div>
                            <div className="inline sm:hidden select-none"></div>
                            <div className="ml-1.5 truncate">{address}</div>
                        </>
                    }
                >
                    {details ? (
                        <div className="flex flex-row items-center mt-4 lg:mt-0">
                            <TransactionDiagram
                                asset={details.asset}
                                to={details.to}
                                from={details.from}
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
                                        <Icon
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
                                        <Icon
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
                                        <Icon
                                            style={{ marginRight: 5 }}
                                            chainName={details.to}
                                        />
                                        {details.to}
                                    </div>
                                </TableRow>
                                {details.fromChain ? (
                                    <TableRow title={<>Address</>}>
                                        <ExternalLink
                                            href={details.fromChain.addressExplorerLink(
                                                address,
                                            )}
                                        >
                                            {address}
                                        </ExternalLink>
                                    </TableRow>
                                ) : null}
                                {details?.gatewayInstance ? (
                                    <TableRow title={<>Deposits</>}>
                                        <div className="flex flex-col">
                                            {details.deposits.map(
                                                (transaction) => (
                                                    <Link
                                                        key={transaction.hash}
                                                        to={`/tx/${transaction.hash}`}
                                                        className="border p-4 rounded-lg mb-4 w-fit flex items-center"
                                                    >
                                                        <Icon
                                                            chainName={
                                                                details.asset
                                                            }
                                                            className="mr-1"
                                                        />
                                                        {utils.isDefined(
                                                            details.decimals,
                                                        ) ? (
                                                            <span>
                                                                {new BigNumber(
                                                                    transaction.params.fromTx.amount,
                                                                )
                                                                    .shiftedBy(
                                                                        -details.decimals,
                                                                    )
                                                                    .toFixed()}
                                                            </span>
                                                        ) : (
                                                            <span className="opacity-50">
                                                                {
                                                                    transaction
                                                                        .params
                                                                        .fromTx
                                                                        .amount
                                                                }
                                                            </span>
                                                        )}
                                                        <span className="ml-1 mr-1">
                                                            {details.asset}
                                                        </span>
                                                        - {transaction.hash}
                                                    </Link>
                                                ),
                                            )}
                                            <div className="flex ml-1">
                                                <Spinner /> Scanning for
                                                deposits
                                            </div>
                                        </div>
                                    </TableRow>
                                ) : null}
                                {!details.gatewayInstance &&
                                loadAdditionalDetails ? (
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
                                        <div>
                                            Error loading gateway:{" "}
                                            {error.message}
                                        </div>
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
