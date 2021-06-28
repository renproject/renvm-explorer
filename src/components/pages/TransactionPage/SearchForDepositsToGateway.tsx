import { Spinner, Button } from "react-bootstrap";
import React, { useCallback, useState } from "react";
import {
  LockAndMint,
  LockAndMintDeposit,
} from "@renproject/ren/build/main/lockAndMint";
import { Link, useHistory } from "react-router-dom";
import { Card } from "@material-ui/core";
import { OrderedMap } from "immutable";
import {
  LegacyRenVMTransaction,
  RenVMTransaction,
} from "../../../lib/searchResult";
import { UIContainer } from "../../../containers/UIContainer";
import BigNumber from "bignumber.js";

interface Props {
  lockAndMint?: LockAndMint | Error | null | undefined;
}

export const SearchForDepositsToGateway: React.FC<Props> = ({
  lockAndMint,
}) => {
  const { setSearchResult } = UIContainer.useContainer();
  const history = useHistory();

  const [fetchingDeposits, setFetchingDeposits] = useState(false);
  const [deposits, setDeposits] = useState<
    OrderedMap<string, LockAndMintDeposit>
  >(OrderedMap());

  const onDeposit = useCallback(
    (deposit) => {
      const txHash = deposit.txHash();
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
      await new Promise((_resolve, reject) => {
        lockAndMint.on("deposit", onDeposit);
      });
    } catch (error) {
      console.error(error);
    }

    setFetchingDeposits(false);
  }, [lockAndMint]);

  const onClick = useCallback(
    (txHash: string, deposit: LockAndMintDeposit) => {
      let result: RenVMTransaction | LegacyRenVMTransaction;
      let url: string;
      if (deposit.renVM.version(deposit._state.selector) >= 2) {
        result = RenVMTransaction(txHash, undefined, deposit);
        url = `/tx/${encodeURIComponent(txHash)}`;
      } else {
        result = LegacyRenVMTransaction(txHash, undefined, deposit);
        url = `/legacy-tx/${encodeURIComponent(txHash)}`;
      }

      setSearchResult(result);
      history.push(url);
    },
    [history, setSearchResult]
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
                      {txHash} - {deposit.depositDetails.amount}
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
