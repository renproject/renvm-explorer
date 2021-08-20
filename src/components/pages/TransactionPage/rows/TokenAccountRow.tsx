import React, { useEffect, useState } from "react";
import { SummarizedTransaction } from "../../../../lib/searchResult";
import { LockAndMint, LockAndMintDeposit } from "@renproject/ren";
import { Button } from "react-bootstrap";
import { UIContainer } from "../../../../containers/UIContainer";
import { useCallback } from "react";
import { MintChain } from "@renproject/interfaces";
import { getMintChainParams } from "../../../../lib/chains/chains";

interface Props {
  queryTx: SummarizedTransaction;
  deposit: LockAndMint | LockAndMintDeposit | Error | undefined | null;
}

export const TokenAccountRow: React.FC<Props> = ({ queryTx, deposit }) => {
  const { getChainDetails } = UIContainer.useContainer();

  const toChain =
    deposit && !(deposit instanceof Error)
      ? deposit.params.to
      : queryTx.summary.toChain;

  const [tokenAccount, setTokenAccount] = useState<string | null | undefined>(
    undefined
  );

  const toChainDetails = toChain ? getChainDetails(toChain.name) : null;

  const asset = queryTx.summary.asset;

  const getTokenAccount = useCallback(async () => {
    if (toChain && toChainDetails && toChainDetails.getTokenAccount) {
      try {
        const maybeTokenAccount = await toChainDetails?.getTokenAccount(
          toChain as MintChain,
          asset
        );

        setTokenAccount(maybeTokenAccount || null);
      } catch (error) {
        setTokenAccount(null);
      }
    }
  }, [toChain, toChainDetails, asset]);

  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (
      !fetched &&
      toChain &&
      toChainDetails &&
      toChainDetails.getTokenAccount
    ) {
      setFetched(true);
      getTokenAccount().catch(console.error);
    }
  }, [fetched, toChain, toChainDetails, getTokenAccount]);

  const onCreateTokenAccount = useCallback(() => {
    (async () => {
      if (!toChain || !toChainDetails || !toChainDetails.createTokenAccount) {
        return;
      }
      await toChainDetails.createTokenAccount(
        toChain as MintChain,
        queryTx.summary.asset
      );
    })().catch(console.error);
  }, [toChain, toChainDetails]);

  return (
    <>
      {toChainDetails && toChainDetails.getTokenAccount ? (
        tokenAccount ? (
          <>
            <tr>
              <td>Token Account</td>
              <td>{tokenAccount}</td>
            </tr>
          </>
        ) : (
          <>
            {" "}
            <tr>
              <td>Token Account</td>
              <td>
                {tokenAccount === undefined ? (
                  <>Loading...</>
                ) : tokenAccount === null ? (
                  <Button
                    variant="outline-success"
                    onClick={onCreateTokenAccount}
                  >
                    Create token account
                  </Button>
                ) : (
                  <p>{tokenAccount}</p>
                )}
              </td>
            </tr>
          </>
        )
      ) : null}
    </>
  );
};
