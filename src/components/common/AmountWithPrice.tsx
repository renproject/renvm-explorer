import { useCoingeckoPrice } from "@usedapp/coingecko";
import { BigNumber } from "bignumber.js";
import { useMemo } from "react";

const CoinGeckoId: { [key: string]: string } = {
    ArbETH: "ethereum",
    AVAX: "avalanche",
    BADGER: "badger-dao",
    BCH: "bitcoin-cash",
    BNB: "bnb",
    BTC: "bitcoin",
    BUSD: "binance-busd",
    CRV: "curve-dao-token",
    DAI: "dai",
    DGB: "digibyte",
    DOGE: "dogecoin",
    ETH: "ethereum",
    EURT: "euro-tether",
    FIL: "filecoin",
    FTM: "fantom",
    FTT: "ftx-token",
    gETH: "ethereum",
    KNC: "kyber-network-crystal",
    LINK: "chainlink",
    LUNA: "terra",
    MATIC: "polygon",
    MIM: "magic-internet-money",
    oETH: "ethereum",
    REN: "ren",
    ROOK: "rook",
    SOL: "solana",
    SUSHI: "sushi",
    UNI: "uniswap",
    USDC: "usd-coin",
    USDT: "tether",
    ZEC: "zcash",
};

export const AmountWithPrice = ({
    asset,
    assetShort,
    assetLabel,
    amount,
}: {
    asset: string;
    assetShort: string;
    assetLabel: string;
    amount: BigNumber | undefined;
}) => {
    const tokenPrice = useCoingeckoPrice(
        CoinGeckoId[assetShort] || assetShort.toLowerCase(),
    );
    const amountInUsd = useMemo(() => {
        return amount && tokenPrice
            ? new BigNumber(amount)
                  .times(tokenPrice)
                  .decimalPlaces(2)
                  .toFormat()
            : undefined;
    }, [tokenPrice, amount]);

    const amountFixed = amount ? amount.toFixed() : "";
    const [, amountFixedSignificant, amountFixedInsignificant] =
        amountFixed.match(/^([^.]+\.?.?.?.?.?)(.*)*$/) || [];

    return (
        <span>
            <>
                <span>
                    {amountFixedSignificant}
                    <span className="text-gray-400">
                        {amountFixedInsignificant}
                    </span>{" "}
                </span>
                {assetLabel}
                <span className="text-gray-500">
                    {amountInUsd ? <> (US${amountInUsd})</> : null}
                </span>
            </>
        </span>
    );
};
