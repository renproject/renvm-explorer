import React from "react";
import { Icons } from "../../lib/chains/icons/chains";

interface Props extends React.SVGProps<SVGSVGElement> {
  chainName: string;
}

export const ChainIcon: React.FC<Props> = ({ chainName, style, ...props }) => {
  const Icon = Icons[chainName];
  return Icon ? (
    <Icon
      {...props}
      style={{
        fill: "white",
        width: "20px",
        height: "20px",
        ...style,
      }}
    />
  ) : null;
};
