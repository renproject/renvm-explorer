import { ResponseQueryTx } from "@renproject/provider";
import { utils } from "@renproject/utils";
import { useCallback, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { createContainer } from "unstated-next";

import { DEBUG } from "../environmentVariables";
import { SummarizedTransaction } from "../lib/searchResult";
import { unmarshalTransaction } from "../lib/searchTactics/searchRenVMHash";
import { UIContainer } from "./UIContainer";

const TX_LIMIT = 8;

function useLatestTransactionsContainer() {
    const { renJS, getChain } = UIContainer.useContainer();
    const [params, setSearchParams] = useSearchParams();
    const location = useLocation();

    const [page, setPage] = useState<number>(
        parseInt(params.get("page") || "0", 10),
    );
    const [latestTransactions, setLatestTransactions] = useState<
        SummarizedTransaction[] | undefined
    >();

    const fetchLatestTransactions = useCallback(
        async (newPage: number) => {
            // setLatestTransactions(undefined);
            const { txs } = (await renJS.provider.sendMessage(
                "ren_queryTxs" as any as never,
                {
                    latest: true,
                    offset: String(newPage * TX_LIMIT),
                    limit: String(TX_LIMIT),
                } as any as never,
            )) as { txs: ResponseQueryTx["tx"][] };
            let txsUnmarshalled = (
                await Promise.all(
                    txs.map(async (tx) => {
                        try {
                            return await unmarshalTransaction(
                                { tx, txStatus: undefined },
                                getChain,
                            );
                        } catch (error) {
                            if (DEBUG) {
                                console.error(error);
                            }
                            return undefined;
                        }
                    }),
                )
            ).filter(utils.isDefined);

            setPage(newPage);
            if (newPage === 0) {
                if (
                    params.has("page") &&
                    params.get("page") !== String(newPage)
                ) {
                    params.delete("page");
                }
            } else {
                if (params.get("page") !== String(newPage)) {
                    params.set("page", String(newPage));
                }
            }

            // If the user is still on the same page that called this function,
            // update the search parameters.
            if (location.pathname === window.location.pathname) {
                setSearchParams(params);
            }
            setLatestTransactions(txsUnmarshalled);
        },
        [
            renJS,
            getChain,
            setLatestTransactions,
            params,
            setSearchParams,
            location.pathname,
        ],
    );

    return {
        page,
        latestTransactions,
        fetchLatestTransactions,
    };
}

export const LatestTransactionsContainer = createContainer(
    useLatestTransactionsContainer,
);
