import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UIContainer } from "../../containers/UIContainer";
import {
    RenVMTransaction,
    SummarizedTransaction,
} from "../../lib/searchResult";
import { classNames } from "../../lib/utils";
import { ChainIcon } from "../common/ChainIcon";
import { TransactionDiagram } from "../pages/TransactionPage/TransactionDiagram";

interface Props {
    queryTx: SummarizedTransaction;
    refreshed: boolean;
}

export const TransactionPreview: React.FC<Props> = ({ queryTx, refreshed }) => {
    const { setSearchResult } = UIContainer.useContainer();
    const navigate = useNavigate();

    const txHash = queryTx.result.hash;

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
        (e) => {
            e.preventDefault();
            setSearchResult(RenVMTransaction(txHash, queryTx));

            // TODO: Investigate alternative to using setTimeout to avoid tx page
            // jumping between transactions.
            // To reproduce: set the timeout to 0 and then on the recent txs page,
            // click one tx, go back and then click another tx.
            setTimeout(() => {
                navigate(`/tx/${encodeURIComponent(txHash)}`);
            }, 100);
        },
        [navigate, setSearchResult, queryTx, txHash],
    );

    const from = queryTx.summary.fromChain
        ? queryTx.summary.fromChain.chain
        : queryTx.summary.from;

    const to = queryTx.summary.toChain
        ? queryTx.summary.toChain.chain
        : queryTx.summary.to;

    const [newlyAdded, setNewlyAdded] = useState(false);
    useEffect(() => {
        setNewlyAdded(true);
        setTimeout(() => setNewlyAdded(false), 0 * 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <tr
            className={classNames(
                newlyAdded ? "bg-green-100" : "bg-white",
                "transition-colors duration-1000",
            )}
        >
            <td className="py-4 px-4 truncate" style={{ maxWidth: "200px" }}>
                <Link
                    className="truncate"
                    key={txHash}
                    // onClick={onClick}
                    to={`/tx/${encodeURIComponent(txHash)}`}
                >
                    {queryTx.result.hash}
                </Link>
            </td>
            {/* <td colSpan={4} className="sm:hidden table-cell col-span-4 py-4">
                <div className="whitespace-nowrap flex items-center justify-center">
                    <ChainIcon chainName={from} />
                    <span style={{ margin: "0px 10px" }}>{" → "}</span>
                    <ChainIcon chainName={queryTx.summary.asset} />
                    <span style={{ margin: "0px 10px" }}>{" → "}</span>
                    <ChainIcon chainName={to} />
                </div>
            </td> */}
            <td className="py-4 hidden sm:table-cell">
                <div className="whitespace-nowrap flex items-center justify-center">
                    <ChainIcon
                        style={{ marginRight: 5, fill: "#001732" }}
                        chainName={from}
                    />
                    {from === "BinanceSmartChain" ? "BSC" : from}
                </div>
            </td>
            <td className="py-4">
                <div className="whitespace-nowrap flex items-center justify-center">
                    <ChainIcon
                        className="mr-1"
                        chainName={queryTx.summary.asset}
                    />
                    {queryTx.summary.amountIn &&
                    !queryTx.summary.amountIn.isNaN() &&
                    !queryTx.summary.amountIn.isZero()
                        ? queryTx.summary.amountIn
                              .decimalPlaces(4, BigNumber.ROUND_DOWN)
                              .isZero()
                            ? "≤0.0001"
                            : queryTx.summary.amountIn
                                  .decimalPlaces(4, BigNumber.ROUND_DOWN)
                                  .toFixed()
                        : ""}{" "}
                    {queryTx.summary.asset}
                </div>
            </td>
            <td className="py-4 hidden sm:table-cell">
                <div className="whitespace-nowrap flex items-center justify-center">
                    <ChainIcon
                        style={{ marginRight: 5, fill: "#001732" }}
                        chainName={to}
                    />
                    {to === "BinanceSmartChain" ? "BSC" : to}
                </div>
            </td>
        </tr>
    );
};
