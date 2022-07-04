// import { useMultiwallet } from "@renproject/multiwallet-ui";
import { CheckIcon } from "@heroicons/react/solid";
import { TxStatus, utils } from "@renproject/utils";
import React from "react";

import { TransactionType } from "../../../lib/searchResult";
import { AsyncButton } from "../../../packages/ChainTxSubmitter/components/AsyncButton";
import { Spinner } from "../../Spinner";

const StatusText = {
    [TxStatus.TxStatusNil]: "No status",
    [TxStatus.TxStatusConfirming]: "Confirming",
    [TxStatus.TxStatusPending]: "Queued",
    [TxStatus.TxStatusExecuting]: "Executing",
    [TxStatus.TxStatusReverted]: "Reverted",
    [TxStatus.TxStatusDone]: "Complete",
};

export const RenderRenVMStatus: React.FC<{
    status: TxStatus | undefined;
    inConfirmations?: number;
    inTarget?: number;
    transactionType: TransactionType;
    revertReason?: string;
    handleRenVMTx?: () => Promise<void>;
}> = ({
    status,
    inConfirmations,
    inTarget,
    transactionType,
    revertReason,
    handleRenVMTx,
}) => {
    switch (status) {
        case TxStatus.TxStatusNil:
        case TxStatus.TxStatusPending:
        case TxStatus.TxStatusExecuting:
        case TxStatus.TxStatusConfirming:
            return (
                <div className="flex items-center">
                    {StatusText[status]}
                    {handleRenVMTx ? (
                        <AsyncButton
                            callOnMount={true}
                            onClick={handleRenVMTx}
                            className={"opacity-50 py-0 border-none bg-none"}
                        >
                            {""}
                        </AsyncButton>
                    ) : null}
                    {status === TxStatus.TxStatusConfirming ? (
                        <>
                            {utils.isDefined(inConfirmations) &&
                            utils.isDefined(inTarget) ? (
                                <span className="ml-1 text-gray-500 text-xs">
                                    {inConfirmations} / {inTarget} confirmations
                                </span>
                            ) : null}
                        </>
                    ) : null}
                </div>
            );
        case TxStatus.TxStatusReverted:
            return (
                <span style={{ color: "#E05C52" }}>
                    {StatusText[status]}
                    {revertReason ? ` - ${revertReason}` : null}
                </span>
            );
        case TxStatus.TxStatusDone:
            return transactionType === TransactionType.Mint ? (
                <>
                    Signed{" "}
                    <CheckIcon className="text-green-600 h-3 -mt-0.5 inline" />
                </>
            ) : (
                <span style={{ color: "#7BB662" }}>Complete</span>
            );
        case undefined:
            return <></>;
    }
};
