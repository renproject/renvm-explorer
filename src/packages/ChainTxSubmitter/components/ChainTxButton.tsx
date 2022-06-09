import {
    ChainTransactionProgress,
    ChainTransactionStatus,
    TxSubmitter,
    TxWaiter,
} from "@renproject/utils";
import { useEffect, useState } from "react";

import { ExternalLink } from "../../../components/common/ExternalLink";
import { classNames } from "../../../lib/utils";
import { AsyncButton } from "./AsyncButton";

interface Props
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onProgress"> {
    // The chain transaction
    chainTx: TxWaiter | TxSubmitter;
    // Whether the transaction should be submitted automatically or with a button click
    autoSubmit?: boolean;
    // Disable the button - if the transaction isn't ready
    disabled?: boolean;
    // Callback for when the transaction emits a progress event
    onProgress?: (progress: ChainTransactionProgress) => void;
}

export const ChainTxButton = ({
    chainTx,
    autoSubmit,
    disabled,
    onProgress,
    className,
    ...props
}: Props) => {
    // Store latest transaction progress.
    const [progress, setProgress] = useState(chainTx.progress);

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
                <AsyncButton
                    {...props}
                    className="flex"
                    onClick={chainTx.submit!.bind(chainTx)}
                    allowOnlyOnce={true}
                    // Pass through ChainTx props
                    callOnMount={autoSubmit}
                    disabled={disabled}
                >
                    Submit {chainTx.chain} transaction
                </AsyncButton>
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
                        "mt-3 inline-flex justify-center rounded-md border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:mt-0 sm:text-sm",
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
                        <span>{progress.transaction?.txHash}</span>
                    )}
                    {progress.status === ChainTransactionStatus.Reverted ? (
                        <span>Reverted: {progress.revertReason}</span>
                    ) : (
                        <>Confirmed</>
                    )}
                </div>
            ) : null}
        </>
    );
};
