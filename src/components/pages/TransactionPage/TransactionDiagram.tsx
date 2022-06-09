import { utils } from "@renproject/utils";
import BigNumber from "bignumber.js";
import React from "react";

import { ChainIcon } from "../../common/ChainIcon";

interface Props {
    asset: string;
    from: string;
    to: string;
    amount?: BigNumber;
}

export const TransactionDiagram: React.FC<Props> = ({
    asset,
    from,
    to,
    amount,
}) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    fontSize: "16px",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    flex: "1",
                }}
            >
                <ChainIcon style={{ marginRight: 5 }} chainName={from} />
                {from}
            </div>
            <span style={{ margin: "0px 10px" }}>{" → "}</span>
            <div
                style={{
                    fontSize: "16px",
                    padding: "6px 10px",
                    color: "#001732",
                    borderRadius: "5px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <ChainIcon style={{ marginRight: 5 }} chainName={asset} />
                <span>
                    {amount ? <>{amount.decimalPlaces(4).toFixed()} </> : null}
                    {asset}
                </span>
            </div>
            <span style={{ margin: "0px 10px" }}>{" → "}</span>
            <div
                style={{
                    fontSize: "16px",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    flex: "1",
                }}
            >
                <ChainIcon style={{ marginRight: 5 }} chainName={to} />
                {to}
            </div>
        </div>
    );
};
