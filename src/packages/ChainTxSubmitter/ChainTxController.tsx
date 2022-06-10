import { Solana } from "@renproject/chains-solana";
import { useCallback, useState } from "react";

import { EthereumClass } from "../../lib/chains/chains/evmChains";
import { ChainType } from "../../lib/chains/chains/types";
import { ChainTxContainer } from "./ChainTxContainer";
import { AsyncButton } from "./components/AsyncButton";
import { Modal } from "./components/Modal";
import { SubmitTxModal } from "./components/SubmitTxModal";

export const ChainTxController = () => {
    const {
        open,
        chainTx,
        setup,
        chainTxChain,
        chainTxChainDetails,
        cancel,
        fetchChainTxExport,
        chainTxExport,
        wallet,
        connect,
        disconnect,
    } = ChainTxContainer.useContainer();

    const details = chainTxExport
        ? [
              ...(chainTxChainDetails?.type === ChainType.EVMChain
                  ? [
                        { label: "To", value: chainTxExport.to },
                        {
                            label: "Data",
                            value: chainTxExport.data,
                        },
                    ]
                  : chainTxChainDetails?.type === ChainType.SolanaChain
                  ? [
                        {
                            label: "Data",
                            value: (
                                <div className="truncate">{chainTxExport}</div>
                            ),
                        },
                    ]
                  : [
                        {
                            label: "...",
                            value: "",
                        },
                    ]),
          ]
        : undefined;

    return (
        <Modal open={open} cancel={cancel}>
            <SubmitTxModal
                wallet={wallet}
                connect={connect}
                disconnect={disconnect}
                chainTx={chainTx}
                setup={setup}
                details={details}
                loadDetails={fetchChainTxExport}
                chain={chainTxChain || undefined}
            ></SubmitTxModal>
        </Modal>
    );
};
