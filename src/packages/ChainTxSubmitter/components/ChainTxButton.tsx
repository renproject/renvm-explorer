import { CheckIcon } from "@heroicons/react/solid";
import {
    Chain,
    ChainTransactionProgress,
    ChainTransactionStatus,
    TxSubmitter,
    TxWaiter,
} from "@renproject/utils";
import { useCallback, useEffect, useState } from "react";

import { ExternalLink } from "../../../components/common/ExternalLink";
import { classNames } from "../../../lib/utils";
import { AsyncButton } from "./AsyncButton";

interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onProgress"> {
    // The chain transaction
    chainTx: TxWaiter | TxSubmitter;
    chain?: Chain;
    // Whether the transaction should be submitted automatically or with a button click
    autoSubmit?: boolean;
    // Disable the button - if the transaction isn't ready
    disabled?: boolean;
    // Callback for when the transaction emits a progress event
    onProgress?: (progress: ChainTransactionProgress) => void;
}

export const ChainTxButton = ({
    chainTx,
    chain,
    autoSubmit,
    disabled,
    onProgress,
    className,
    ...props
}: Props) => {
    // Store latest transaction progress.
    const [progress, setProgress] = useState(chainTx.progress);

    const [networkCheck, setNetworkCheck] = useState<
        | {
              result: boolean;
              actualNetworkId: string | number;

              expectedNetworkId: string | number;
              expectedNetworkLabel: string;
          }
        | { result: true }
        | undefined
    >();
    // Callback to check whether the wallet's network is correct.
    const checkNetwork = useCallback(async () => {
        const result: typeof networkCheck =
            chain && chain.checkSignerNetwork
                ? await chain.checkSignerNetwork()
                : { result: true };
        setNetworkCheck(result);
        return result;
    }, [chain]);

    // Callback to trigger the user to change their network.
    const switchNetwork = useCallback(async () => {
        const preNetworkCheck = await checkNetwork();
        if (preNetworkCheck.result) {
            return;
        }

        if (!chain || !chain.switchSignerNetwork) {
            throw new Error(
                `Network must be changed manually to ${preNetworkCheck.expectedNetworkLabel}.`,
            );
        } else {
            await chain.switchSignerNetwork();
        }

        const postNetworkCheck = await checkNetwork();
        if (!postNetworkCheck.result) {
            throw new Error(
                `Failed to set network to ${postNetworkCheck.expectedNetworkLabel}.`,
            );
        }
    }, [chain, checkNetwork]);

    // Callback to submit the transaction.
    const submit = useCallback(async () => {
        if (!chainTx.submit) {
            return;
        }

        const preNetworkCheck = await checkNetwork();
        if (!preNetworkCheck.result) {
            throw new Error(
                `Wallet network must be changed to ${preNetworkCheck.expectedNetworkLabel}.`,
            );
        }

        await chainTx.submit();
    }, [chainTx, checkNetwork]);

    useEffect(() => {
        // When a new progress event is available, update the state and
        // propagate the event upwards.
        const progressHandler = (progress: ChainTransactionProgress) => {
            setProgress(progress);
            if (onProgress) {
                onProgress(progress);
            }
        };
        chainTx.eventEmitter.on("progress", progressHandler);
        progressHandler(chainTx.progress);

        // Remove the listener when this ChainTx component is unmounted.
        return () => {
            chainTx.eventEmitter.removeListener("progress", progressHandler);
        };
    }, [chainTx, setProgress, onProgress]);

    return (
        <>
            {/* "ready" */}
            {progress.status === ChainTransactionStatus.Ready ? (
                <>
                    {!networkCheck ? (
                        <AsyncButton
                            {...props}
                            key="1"
                            className="flex"
                            onClick={checkNetwork}
                            allowOnlyOnce={true}
                            callOnMount={!disabled && !!chain}
                            disabled={disabled}
                        >
                            {(calling) =>
                                disabled ? (
                                    <>Submit {chainTx.chain} transaction</>
                                ) : (
                                    <>
                                        {calling ? "Checking" : "Check"} wallet
                                        network
                                    </>
                                )
                            }
                        </AsyncButton>
                    ) : !networkCheck.result ? (
                        <AsyncButton
                            {...props}
                            key="2"
                            className="flex"
                            onClick={switchNetwork}
                            allowOnlyOnce={true}
                            // Pass through ChainTx props
                            callOnMount={false}
                        >
                            {(calling) => (
                                <>
                                    {calling ? "Switching" : "Switch"} wallet
                                    network
                                </>
                            )}
                        </AsyncButton>
                    ) : (
                        <AsyncButton
                            {...props}
                            key="3"
                            className="flex"
                            onClick={submit}
                            allowOnlyOnce={true}
                            // Pass through ChainTx props
                            callOnMount={autoSubmit}
                            disabled={disabled}
                        >
                            {(calling) => (
                                <>
                                    {calling ? "Submitting" : "Submit"}{" "}
                                    {chainTx.chain} transaction
                                </>
                            )}
                        </AsyncButton>
                    )}
                </>
            ) : null}

            {/* "ready" */}
            {progress.status === ChainTransactionStatus.Confirming ? (
                <AsyncButton
                    {...props}
                    className="flex"
                    onClick={chainTx.wait!.bind(chainTx)}
                    allowOnlyOnce={true}
                    // Pass through ChainTx props
                    callOnMount={true}
                    disabled={disabled}
                >
                    {progress.transaction?.explorerLink ? (
                        <ExternalLink
                            className="truncate w-56 block"
                            href={progress.transaction?.explorerLink}
                        >
                            {progress.transaction?.txHash}
                        </ExternalLink>
                    ) : (
                        <span>{progress.transaction?.txHash}</span>
                    )}
                    {progress.confirmations === undefined
                        ? "..."
                        : progress.confirmations}{" "}
                    / {progress.target} confirmations
                </AsyncButton>
            ) : null}

            {/* confirming */}
            {progress.status === ChainTransactionStatus.Done ||
            progress.status === ChainTransactionStatus.Reverted ? (
                <div
                    className={classNames(
                        "mt-3 inline-flex rounded-md border-gray-300 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:mt-0 sm:text-sm",
                        className || "",
                    )}
                >
                    {progress.transaction?.explorerLink ? (
                        <ExternalLink
                            className="truncate w-56 block"
                            href={progress.transaction?.explorerLink}
                        >
                            {progress.transaction?.txHash}
                        </ExternalLink>
                    ) : (
                        <span className="truncate w-56 block">
                            {progress.transaction?.txHash}
                        </span>
                    )}
                    {progress.status === ChainTransactionStatus.Reverted ? (
                        <span>Reverted: {progress.revertReason}</span>
                    ) : (
                        <div className="flex items-center">
                            Confirmed
                            <CheckIcon className="text-green-600 h-3 ml-1 -mt-0.5 inline" />
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
};
