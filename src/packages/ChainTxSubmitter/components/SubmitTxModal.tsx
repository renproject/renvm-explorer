import { Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import {
    Chain,
    ChainTransactionProgress,
    TxSubmitter,
    TxWaiter,
} from "@renproject/utils";
import { sentenceCase } from "change-case";
import React from "react";

import { Icon } from "../../../components/common/icons/Icon";
import { Wallet } from "../../../containers/WalletContainer";
import { AsyncButton } from "./AsyncButton";
import { ChainTxButton } from "./ChainTxButton";

interface Props {
    wallet: Wallet | undefined;
    connect: (chain: string) => Promise<void>;
    disconnect: (chain: string) => void;

    chainTx?:
        | TxWaiter<ChainTransactionProgress>
        | TxSubmitter<ChainTransactionProgress, unknown, {}>;
    setup?: {
        [key: string]:
            | TxWaiter<ChainTransactionProgress>
            | TxSubmitter<ChainTransactionProgress, {}, {}>;
    };
    details?: Array<{ label: React.ReactNode; value: React.ReactNode }>;
    loadDetails: () => Promise<void>;
    chain?: Chain;
}

export const SubmitTxModal: React.FC<Props> = ({
    chainTx,
    setup,
    wallet,
    connect,
    disconnect,
    details,
    loadDetails,
    chain,
}) => {
    return (
        <div className="sm:flex sm:items-start flex-col">
            <div className="text-center sm:text-left w-full p-4 border-b border-gray-500">
                <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium flex items-center"
                >
                    <Icon chainName={chainTx?.chain || ""} className="mr-1" />{" "}
                    Submit {chainTx?.chain} transaction
                </Dialog.Title>
            </div>
            <div className="w-full border-b border-gray-200 px-4 py-2">
                <span className="text-xs uppercase text-gray-600 font-bold">
                    Wallet
                </span>
                <div className="w-full py-2">
                    {wallet ? (
                        <div className="flex justify-between border border-gray-300 rounded-md p-2">
                            <span className="text-sm font-mono font-bold truncate">
                                {wallet.address}
                            </span>
                            <button
                                onClick={() => disconnect(chainTx?.chain || "")}
                                className="px-1 w-fit flex items-center text-xs"
                            >
                                <XIcon className="mr-1 h-3 text-gray-500" />{" "}
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="w-fit inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:text-sm"
                            onClick={() => connect(chainTx?.chain || "")}
                        >
                            Connect
                        </button>
                    )}
                </div>
            </div>
            <div className="w-full border-b border-gray-200 px-4 py-2">
                <span className="text-xs uppercase text-gray-600 font-bold">
                    Transaction Details
                </span>
                <dl className="sm:divide-y sm:divide-gray-200">
                    {details ? (
                        details.map((row, index) => (
                            <div
                                key={index}
                                className="sm:grid sm:grid-cols-6 sm:gap-6 py-2"
                            >
                                <dt className="text-sm font-medium text-gray-500">
                                    {row.label}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-5 truncate">
                                    {row.value}
                                </dd>
                            </div>
                        ))
                    ) : wallet !== undefined ? (
                        <AsyncButton
                            callOnMount={wallet !== undefined}
                            onClick={loadDetails}
                        >
                            {(calling) => (
                                <>{calling ? "Loading" : "Load"} details</>
                            )}
                        </AsyncButton>
                    ) : (
                        <div>Connect wallet to see details</div>
                    )}
                </dl>
            </div>
            {setup &&
                Object.keys(setup).map((key) => {
                    return (
                        <div className="w-full px-4 py-4 border-b flex items-center">
                            <span className="mr-2">{sentenceCase(key)}:</span>
                            <ChainTxButton
                                chain={chain}
                                className="w-full"
                                chainTx={setup[key]}
                                disabled={wallet === undefined}
                            />
                        </div>
                    );
                })}
            <div className="w-full px-4 py-4">
                {chainTx ? (
                    <ChainTxButton
                        chain={chain}
                        className="w-full"
                        chainTx={chainTx}
                        disabled={wallet === undefined}
                    />
                ) : null}
            </div>
        </div>
    );
};
