import { useCoingeckoPrice } from "@usedapp/coingecko";
import { BigNumber } from "bignumber.js";
import { useMemo } from "react";

const CoinGeckoId: { [key: string]: string } = {
    ETH: "ethereum",
    USDC: "usd-coin",
};

export const AmountWithPrice = ({
    asset,
    amount,
}: {
    asset: string;
    amount: BigNumber | undefined;
}) => {
    const tokenPrice = useCoingeckoPrice(
        CoinGeckoId[asset] || asset.toLowerCase(),
    );
    const amountInUsd = useMemo(() => {
        return amount && tokenPrice
            ? new BigNumber(amount).times(tokenPrice).decimalPlaces(2).toFixed()
            : undefined;
    }, [tokenPrice, amount]);

    const amountFixed = amount ? amount.toFixed() : "";
    const [, amountFixedSignificant, amountFixedInsignificant] =
        amountFixed.match(/^([^.]\.?.?.?.?.?)(.*)*$/) || [];

    return (
        <span>
            <>
                <span>
                    {amountFixedSignificant}
                    <span className="text-gray-400">
                        {amountFixedInsignificant}
                    </span>{" "}
                </span>
                {asset}
                <span className="text-gray-500">
                    {amountInUsd ? <> (US${amountInUsd})</> : null}
                </span>
            </>
        </span>
    );
};
