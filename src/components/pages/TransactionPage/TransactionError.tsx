import React from "react";
import { TaggedError } from "../../../lib/taggedError";
import { RenVMTransactionError } from "../../../lib/searchResult";
import { Monospaced } from "../../common/Monospaced";

interface Props {
  txHash: string;
  error: TaggedError | Error;
}

export const TransactionError: React.FC<Props> = ({ txHash, error }) => {
  return (
    <div
      style={{
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {(error as TaggedError)._tag ===
      RenVMTransactionError.TransactionNotFound ? (
        <>
          <p
            style={{
              fontSize: 70,
              fontWeight: 300,
              color: "#001732",
            }}
          >
            404
          </p>
          <p>
            Transaction <Monospaced>{txHash}</Monospaced> not found
          </p>
        </>
      ) : (
        <>Error fetching transaction. ({error.message})</>
      )}
    </div>
  );
};
