import { OrderedMap } from "immutable";
import React, { useCallback, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import { Card } from "@material-ui/core";
import { Gateway, GatewayTransaction } from "@renproject/ren";

import { UIContainer } from "../../../containers/UIContainer";
import {
  LegacyRenVMTransaction,
  RenVMTransaction,
} from "../../../lib/searchResult";

interface Props {
  lockAndMint?: Gateway | Error | null | undefined;
}

export const SearchForDepositsToGateway: React.FC<Props> = ({
  lockAndMint,
}) => {
  const { setSearchResult } = UIContainer.useContainer();
  const navigate = useNavigate();

  const [fetchingDeposits, setFetchingDeposits] = useState(false);
  const [deposits, setDeposits] = useState(
    OrderedMap<string, GatewayTransaction>()
  );

  const onDeposit = useCallback(
    (deposit: GatewayTransaction) => {
      const txHash = deposit.hash;
      // deposit.signed();
      setDeposits((deposits) => deposits.set(txHash, deposit));
    },
    [setDeposits]
  );

  const fetchDeposits = useCallback(async () => {
    if (!lockAndMint || lockAndMint instanceof Error) {
      return;
    }

    setFetchingDeposits(true);

    try {
      await new Promise((_resolve, _reject) => {
        lockAndMint.on("transaction", onDeposit);
      });
    } catch (error: any) {
      console.error(error);
    }

    setFetchingDeposits(false);
  }, [lockAndMint, onDeposit]);

  const onClick = useCallback(
    (txHash: string, deposit: GatewayTransaction) => {
      let result: RenVMTransaction | LegacyRenVMTransaction;
      let url: string;
      // if (deposit.renVM.version(deposit._state.selector) >= 2) {
      result = RenVMTransaction(txHash, undefined, deposit);
      url = `/tx/${encodeURIComponent(txHash)}`;
      // } else {
      //   result = LegacyRenVMTransaction(txHash, undefined, deposit);
      //   url = `/legacy-tx/${encodeURIComponent(txHash)}`;
      // }

      setSearchResult(result);
      navigate(url);
    },
    [navigate, setSearchResult]
  );

  return (
    <>
      {lockAndMint && !(lockAndMint instanceof Error) ? (
        fetchingDeposits ? (
          <>
            <>Searching for deposits</>
            <Spinner
              size="sm"
              animation="border"
              role="status"
              variant="success"
              style={{
                borderWidth: 1,
                marginLeft: 5,
              }}
            ></Spinner>
          </>
        ) : (
          <Button
            disabled={fetchingDeposits}
            variant="outline-success"
            onClick={fetchDeposits}
            style={{ marginLeft: 10 }}
          >
            Search for deposits
          </Button>
        )
      ) : null}
      {deposits.size > 0 ? (
        <>
          <br />
          <br />
          <h5>Deposits found:</h5>
          <div style={{ display: "flex", flexFlow: "column" }}>
            {deposits
              .map((deposit, txHash) => {
                const clickHandler: React.MouseEventHandler<HTMLAnchorElement> =
                  (e) => {
                    e.preventDefault();
                    onClick(txHash, deposit);
                  };
                return (
                  <Link key={txHash} onClick={clickHandler} to={""}>
                    <Card style={{ padding: 20, display: "inline-block" }}>
                      {txHash} - {deposit.params.fromTx.amount}
                    </Card>
                  </Link>
                );
              })
              .valueSeq()
              .toArray()}
          </div>
        </>
      ) : null}
    </>
  );
};
