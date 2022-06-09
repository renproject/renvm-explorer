import { ResponseQueryTx } from "@renproject/provider";
import {
    ChainTransaction,
    ChainTransactionProgress,
    TxStatus,
    TxSubmitter,
    TxWaiter,
} from "@renproject/utils";
import { useCallback, useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import { UIContainer } from "../../containers/UIContainer";
import { Wallet, WalletContainer } from "../../containers/WalletContainer";

function useChainTxContainer() {
    const { renJS, getChain, getChainDetails } = UIContainer.useContainer();
    const {
        wallets,
        connect: connectWallet,
        disconnect: disconnectWallet,
    } = WalletContainer.useContainer();

    const [open, setOpen] = useState(false);
    const [chainTx, setChainTx] = useState<
        | TxWaiter<ChainTransactionProgress>
        | TxSubmitter<ChainTransactionProgress, unknown, {}>
        | undefined
    >();
    const [setup, setSetup] = useState<{
        [key: string]:
            | TxWaiter<ChainTransactionProgress>
            | TxSubmitter<ChainTransactionProgress, {}, {}>;
    }>();

    const [chainTxExport, setChainTxExport] = useState<any>();

    const [promiseController, setPromiseController] = useState<{
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }>();

    const handleChainTransaction = useCallback(
        (
            chainTx:
                | TxWaiter<ChainTransactionProgress>
                | TxSubmitter<ChainTransactionProgress, unknown, {}>,
            setup?: {
                [key: string]:
                    | TxWaiter<ChainTransactionProgress>
                    | TxSubmitter<ChainTransactionProgress, {}, {}>;
            },
        ) => {
            setChainTx(chainTx);
            setSetup(setup);
            setChainTxExport(undefined);
            setOpen(true);
            return new Promise<void>((resolve, reject) => {
                setPromiseController({ resolve, reject });
            });
        },
        [setChainTx, setChainTxExport, setOpen, setPromiseController],
    );

    const fetchChainTxExport = useCallback(async () => {
        setChainTxExport(await chainTx?.export?.());
    }, [chainTx]);

    const clearChainTxExport = useCallback(async () => {
        setChainTxExport(undefined);
    }, []);

    const cancel = useCallback(() => {
        promiseController?.reject(new Error(`Cancelled.`));
        setOpen(false);
    }, [promiseController]);

    const done = useCallback(() => {
        setOpen(false);
        promiseController?.resolve(undefined);
    }, [promiseController]);

    const chainTxChain = chainTx ? getChain(chainTx.chain) : null;
    const chainTxChainDetails = chainTx ? getChainDetails(chainTx.chain) : null;

    const [wallet, setWallet] = useState<Wallet | undefined>(
        wallets.get(chainTxChain?.chain || ""),
    );

    const connect = useCallback(
        async (chain: string) => {
            const wallet = await connectWallet({ chain });
            renJS.chains[chain].withSigner?.(wallet.signer);
            setWallet(wallet);
        },
        [renJS.chains, connectWallet],
    );

    const disconnect = useCallback(() => {
        disconnectWallet(chainTx?.chain || "");
        clearChainTxExport();
        setWallet(undefined);
    }, [chainTx, clearChainTxExport, disconnectWallet]);

    return {
        renJS,
        open,
        chainTx,
        setup,
        chainTxChain,
        chainTxChainDetails,
        chainTxExport,
        fetchChainTxExport,
        clearChainTxExport,
        promiseController,
        handleChainTransaction,
        cancel,
        done,
        wallet,
        connect,
        disconnect,
    };
}

export const ChainTxContainer = createContainer(useChainTxContainer);
