import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { SummarizedTransaction } from "../../lib/searchResult";
import { classNames } from "../../lib/utils";
import { Icon } from "../common/icons/Icon";

interface Props {
    queryTx: SummarizedTransaction;
    refreshed: boolean;
}

export const TransactionPreview: React.FC<Props> = ({ queryTx, refreshed }) => {
    const txHash = queryTx.result.hash;

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
                    <Icon
                        style={{ marginRight: 5, fill: "#001732" }}
                        chainName={from}
                    />
                    {from === "BinanceSmartChain" ? "BSC" : from}
                </div>
            </td>
            <td className="py-4">
                <div className="whitespace-nowrap flex items-center justify-center">
                    <Icon className="mr-1" chainName={queryTx.summary.asset} />
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
                    <Icon
                        style={{ marginRight: 5, fill: "#001732" }}
                        chainName={to}
                    />
                    {to === "BinanceSmartChain" ? "BSC" : to}
                </div>
            </td>
        </tr>
    );
};
