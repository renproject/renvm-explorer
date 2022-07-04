import BigNumber from "bignumber.js";
import React from "react";

import { Icon } from "./icons/Icon";

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
        <div className="flex items-center">
            <div
                className="2xs:border border-gray-200 2xs:px-3 2xs:py-2"
                style={{
                    fontSize: "16px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    flex: "1",
                }}
            >
                <Icon chainName={from} />
                <span className="hidden xs:inline ml-2">{from}</span>
            </div>
            <span style={{ margin: "0px 10px" }}>{" → "}</span>
            <div
                className="2xs:border border-gray-200 2xs:px-3 2xs:py-2"
                style={{
                    fontSize: "16px",
                    color: "#001732",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Icon chainName={asset} />
                <span className="hidden 2xs:inline ml-2">
                    {amount ? <>{amount.decimalPlaces(4).toFixed()} </> : null}
                    {asset}
                </span>
            </div>
            <span style={{ margin: "0px 10px" }}>{" → "}</span>
            <div
                className="2xs:border border-gray-200 2xs:px-3 2xs:py-2"
                style={{
                    fontSize: "16px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    flex: "1",
                }}
            >
                <Icon chainName={to} />
                <span className="hidden xs:inline ml-2">{to}</span>
            </div>
        </div>
    );
};
