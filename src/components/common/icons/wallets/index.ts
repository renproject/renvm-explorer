import React from "react";

import MetaMask from "./metamask.png";
import { ReactComponent as Phantom } from "./phantom.svg";

export const Icons: {
    [key: string]:
        | React.FunctionComponent<
              React.SVGProps<SVGSVGElement> & {
                  title?: string | undefined;
              }
          >
        | string;
} = {
    MetaMask,
    Phantom,
};
