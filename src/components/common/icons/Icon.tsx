import React from "react";

import { classNames } from "../../../lib/utils";
import { Icons as AssetIcons } from "./assets";
import { Icons as ChainIcons } from "./chains";
import { Icons as WhiteChainIcons } from "./chains-white";
import { Icons as WalletIcons } from "./wallets";

interface Props {
    chainName: string;
    white?: boolean;
}

export const Icon: React.FC<
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
