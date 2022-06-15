// import { useMultiwallet } from "@renproject/multiwallet-ui";
import { CheckIcon } from "@heroicons/react/solid";
import { TxStatus } from "@renproject/utils";
import React from "react";

import { TransactionType } from "../../../lib/searchResult";

export const RenderRenVMStatus: React.FC<{
    status: TxStatus;
    transactionType: TransactionType;
    revertReason?: string;
}> = ({ status, transactionType, revertReason }) => {
    switch (status) {
        case TxStatus.TxStatusNil:
            return <>No status</>;
        case TxStatus.TxStatusConfirming:
            return <>Confirming</>;
        case TxStatus.TxStatusPending:
            return <>Queued</>;
        case TxStatus.TxStatusExecuting:
            return <>Executing</>;
        case TxStatus.TxStatusReverted:
            return (
                <span style={{ color: "#E05C52" }}>
                    Reverted{revertReason ? ` - ${revertReason}` : null}
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
    }
};
