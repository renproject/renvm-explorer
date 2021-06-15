import { RenNetwork } from "@renproject/interfaces";
import { WalletPickerModal } from "@renproject/multiwallet-ui";
import React from "react";

import { multiwalletOptions } from "../lib/multiwalletConfig";

interface Props {
  chain: string | null;
  close: () => void;
  network: RenNetwork.Testnet | RenNetwork.Mainnet;
}

export const ConnectWallet: React.FC<Props> = ({ chain, close, network }) => {
  return (
    <WalletPickerModal
      open={chain !== null}
      options={{
        targetNetwork: network,
        chain: chain || "",
        onClose: close,
        config: multiwalletOptions,
      }}
    />
  );
};
