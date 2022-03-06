import React, { useState } from "react";
import { Button } from "react-bootstrap";

import { DepositCommon, TxStatus } from "@renproject/interfaces";
import { useMultiwallet } from "@renproject/multiwallet-ui";
import {
    DepositStatus,
    LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";

import { NETWORK } from "../../../../environmentVariables";
import {
    SummarizedTransaction,
    TransactionType,
} from "../../../../lib/searchResult";
import { ConnectWallet } from "../../../Multiwallet";

interface Props {
  queryTx: SummarizedTransaction;
  deposit:
    | LockAndMintDeposit<any, DepositCommon<any>, any, any, any>
    | Error
    | undefined
    | null;
}

export const StatusRow: React.FC<Props> = ({ queryTx, deposit }) => {
  const { enabledChains } = useMultiwallet();

  // Multiwallet modal
  const [multiwalletChain, setMultiwalletChain] = React.useState<string | null>(
    null
  );
  const closeMultiwallet = () => {
    setMultiwalletChain(null);
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<String | null>(null);

  const mintChain =
    deposit && !(deposit instanceof Error) && deposit.params.to.name;

  const connectMintChain = React.useCallback(() => {
    if (!mintChain) {
      return;
    }
    setMultiwalletChain(mintChain);
  }, [mintChain, setMultiwalletChain]);

  const mintChainProvider =
    mintChain && enabledChains[mintChain] && enabledChains[mintChain].provider;

  const submit = React.useCallback(() => {
    (async () => {
      if (!deposit || deposit instanceof Error) {
        return;
      }

      setSubmitting(true);
      setSubmitError(null);

      if (deposit.params.to.withProvider) {
        await deposit.params.to.withProvider(mintChainProvider);
      }
      await deposit.mint();
    })()
      .finally(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        console.error(error);
        if (
          queryTx.summary.to === "Solana" &&
          String(error.message || error).match(/AccountNotFound/)
        ) {
          setSubmitError(
            `Can only submit from ${
              deposit && !(deposit instanceof Error)
                ? deposit.params.contractCalls?.[0]?.sendTo
                : "the recipient account"
            }.`
          );
        } else {
          setSubmitError(String(error.message || error));
        }
      });
  }, [mintChainProvider, deposit, queryTx.summary.to]);

  return (
    <>
      {(!deposit || deposit instanceof Error) &&
      queryTx.result.txStatus === TxStatus.TxStatusNil ? null : (
        <tr>
          <td>Status</td>
          <td>
            {queryTx.result.txStatus === TxStatus.TxStatusDone &&
            queryTx.result.out.revert &&
            queryTx.result.out.revert.length > 0 ? (
              <>
                <RenderRenVMStatus
                  transactionType={queryTx.transactionType}
                  status={TxStatus.TxStatusReverted}
                  revertReason={queryTx.result.out.revert}
                />
              </>
            ) : (
              <>
                <div className="connect-wallets">
                  <ConnectWallet
                    chain={multiwalletChain}
                    close={closeMultiwallet}
                    network={NETWORK}
                  />
                </div>

                {deposit && !(deposit instanceof Error) ? (
                  <>
                    <RenderDepositStatus status={deposit.status} />

                    {deposit &&
                    !(deposit instanceof Error) &&
                    deposit.status === DepositStatus.Signed ? (
                      mintChainProvider ? (
                        <>
                          <Button
                            variant="outline-success"
                            disabled={submitting}
                            onClick={submit}
                            style={{ marginLeft: 5 }}
                          >
                            {submitting ? <>Submitting...</> : <>Submit</>}
                          </Button>
                          {submitError ? (
                            <p style={{ color: "#e33e33" }}>{submitError}</p>
                          ) : null}
                        </>
                      ) : (
                        <Button
                          variant="outline-success"
                          onClick={connectMintChain}
                          style={{ marginLeft: 5 }}
                        >
                          Connect wallet
                        </Button>
                      )
                    ) : null}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        opacity:
                          queryTx.transactionType === TransactionType.Mint
                            ? 0.3
                            : 1,
                      }}
                    >
                      <RenderRenVMStatus
                        transactionType={queryTx.transactionType}
                        status={queryTx.result.txStatus}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

const RenderRenVMStatus: React.FC<{
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
        <>Signed</>
      ) : (
        <span style={{ color: "#7BB662" }}>Complete</span>
      );
  }
};

const RenderDepositStatus: React.FC<{ status: DepositStatus }> = ({
  status,
}) => {
  switch (status) {
    case DepositStatus.Detected:
      return <>Confirming</>;
    case DepositStatus.Confirmed:
      return <>Submitting to RenVM</>;
    case DepositStatus.Signed:
      return <span style={{ color: "#97b85d" }}>Ready for minting</span>;
    case DepositStatus.Reverted:
      return <span style={{ color: "#e33e33" }}>Reverted</span>;
    case DepositStatus.Submitted:
      return <span style={{ color: "#97b85d" }}>Complete</span>;
  }
};