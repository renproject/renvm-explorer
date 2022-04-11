import { useCallback, useState } from "react";
import { createContainer } from "unstated-next";

import { ResponseQueryTx } from "@renproject/provider";
import { TxStatus } from "@renproject/utils";

import { SummarizedTransaction } from "../lib/searchResult";
import { unmarshalTransaction } from "../lib/searchTactics/searchRenVMHash";
import { UIContainer } from "./UIContainer";

function useLatestTransactionsContainer() {
  const { renJS, getChain } = UIContainer.useContainer();

  const [latestTransactions, setLatestTransactions] = useState<
    SummarizedTransaction[] | null | undefined
  >();

  const fetchLatestTransactions = useCallback(async () => {
    const { txs } = (await renJS.provider.sendMessage(
      "ren_queryTxs" as any as never,
      { latest: true } as any as never
    )) as { txs: ResponseQueryTx["tx"][] };
    console.log(txs);
    let txsUnmarshalled = await Promise.all(
      txs.map((tx) =>
        unmarshalTransaction({ tx, txStatus: TxStatus.TxStatusNil }, getChain)
      )
    );

    setLatestTransactions(txsUnmarshalled);
  }, [renJS, getChain, setLatestTransactions]);

  return {
    latestTransactions,
    fetchLatestTransactions,
  };
}

export const LatestTransactionsContainer = createContainer(
  useLatestTransactionsContainer
);
