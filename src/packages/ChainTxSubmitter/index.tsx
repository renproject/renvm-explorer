import { PropsWithChildren } from "react";

import { ChainTxContainer } from "./ChainTxContainer";
import { ChainTxController } from "./ChainTxController";

const Provider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <>
            <ChainTxContainer.Provider>
                <ChainTxController />
                {children}
            </ChainTxContainer.Provider>
        </>
    );
};

export const ChainTxSubmitter = {
    Provider,
    useContainer: ChainTxContainer.useContainer,
};
