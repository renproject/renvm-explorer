import React from "react";

import { Icons as AssetIcons } from "../../lib/chains/icons/assets";
import { Icons as ChainIcons } from "../../lib/chains/icons/chains";
import { Icons as WhiteChainIcons } from "../../lib/chains/icons/chains-white";
import { Icons as WalletIcons } from "../../lib/chains/icons/wallets";
import { classNames } from "../../lib/utils";

interface Props {
    chainName: string;
    white?: boolean;
}

export const ChainIcon: React.FC<
    Props &
        (React.SVGProps<SVGSVGElement> &
            React.DetailedHTMLProps<
                React.ImgHTMLAttributes<HTMLImageElement>,
                HTMLImageElement
            >)
> = ({ chainName, white, className, ...props }) => {
    const Icon =
        (white && WhiteChainIcons[chainName]) ||
        ChainIcons[chainName] ||
        AssetIcons[chainName] ||
        WalletIcons[chainName];
    return Icon ? (
        typeof Icon === "string" ? (
            <img
                src={Icon}
                alt={`${chainName} logo`}
                className={classNames("w-5 h-5", className || "")}
                {...props}
            />
        ) : (
            <Icon
                className={classNames("w-5 h-5", className || "")}
                {...props}
            />
        )
    ) : null;
};
