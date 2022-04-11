import React from "react";

import { WalletPickerModal } from "@renproject/multiwallet-ui";
import { RenNetwork } from "@renproject/utils";

import { multiwalletOptions } from "../lib/chains/chains";

interface Props {
  chain: string | null;
  close: () => void;
  network: RenNetwork;
}

export const ConnectWallet: React.FC<Props> = ({ chain, close, network }) => {
  return (
    <WalletPickerModal
      open={chain !== null}
      options={{
        targetNetwork: network,
        chain: chain || "",
        onClose: close,
        config: multiwalletOptions(network),
      }}
    />
  );
};
