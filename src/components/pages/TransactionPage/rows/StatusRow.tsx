import { Button } from "react-bootstrap";
import React, { useState } from "react";
import {
  DepositStatus,
  LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";
import {
  BurnAndReleaseTransaction,
  DepositCommon,
  getRenNetworkDetails,
  LockAndMintTransaction,
  RenNetwork,
  TxStatus,
} from "@renproject/interfaces";
import { useMultiwallet } from "@renproject/multiwallet-ui";
import { ConnectWallet } from "../../../Multiwallet";
import { NETWORK } from "../../../../environmentVariables";
import { TransactionSummary } from "../../../../lib/searchResult";

interface Props {
  queryTx:
    | {
        result: LockAndMintTransaction;
        isMint: true;
        summary: TransactionSummary;
      }
    | {
        result: BurnAndReleaseTransaction;
        isMint: false;
        summary: TransactionSummary;
      };
  deposit:
    | LockAndMintDeposit<any, DepositCommon<any>, any, any, any>
    | Error
    | undefined
    | null;
}

export const StatusRow: React.FC<Props> = ({ queryTx, deposit }) => {
  const { enabledChains } = useMultiwallet();

  // Multiwallet modal
  const [multiwalletChain, setMultiwalletChain] =
    React.useState<string | null>(null);
  const closeMultiwallet = () => {
    setMultiwalletChain(null);
  };

  const [submitting, setSubmitting] = useState(false);

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

      if (deposit.params.to.withProvider) {
        await deposit.params.to.withProvider(mintChainProvider);
      }
      await deposit.mint();
    })()
      .finally(() => {
        setSubmitting(false);
      })
      .catch(console.error);
  }, [mintChainProvider, deposit]);

  return (
    <>
      <div className="connect-wallets">
        <ConnectWallet
          chain={multiwalletChain}
          close={closeMultiwallet}
          network={
            getRenNetworkDetails(NETWORK).isTestnet
              ? RenNetwork.Testnet
              : RenNetwork.Mainnet
          }
        />
      </div>
      <tr>
        <td>Status</td>
        <td>
          {deposit && !(deposit instanceof Error) ? (
            <>
              <RenderDepositStatus status={deposit.status} />

              {deposit &&
              !(deposit instanceof Error) &&
              deposit.status === DepositStatus.Signed ? (
                mintChainProvider ? (
                  <Button
                    variant="outline-success"
                    disabled={submitting}
                    onClick={submit}
                    style={{ marginLeft: 5 }}
                  >
                    {submitting ? <>Submitting...</> : <>Submit</>}
                  </Button>
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
              <div style={{ opacity: queryTx.isMint ? 0.3 : 1 }}>
                <RenderRenVMStatus
                  isMint={queryTx.isMint}
                  status={queryTx.result.txStatus}
                />
              </div>
            </div>
          )}
        </td>
      </tr>
    </>
  );
};

const RenderRenVMStatus: React.FC<{ status: TxStatus; isMint: boolean }> = ({
  status,
  isMint,
}) => {
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
      return <>Reverted</>;
    case TxStatus.TxStatusDone:
      return isMint ? (
        <>Signed</>
      ) : (
        <span style={{ color: "green" }}>Complete</span>
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
      return <span style={{ color: "green" }}>Ready for minting</span>;
    case DepositStatus.Reverted:
      return <span style={{ color: "red" }}>Reverted</span>;
    case DepositStatus.Submitted:
      return <span style={{ color: "green" }}>Complete</span>;
  }
};
