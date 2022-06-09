import { Dialog } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/outline";
import SolanaWallet from "@project-serum/sol-wallet-adapter";
import { PublicKey } from "@solana/web3.js";
import { ethers } from "ethers";
import { Map } from "immutable";
import React, { useCallback, useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import { ChainIcon } from "../components/common/ChainIcon";
import { Modal } from "../packages/ChainTxSubmitter/components/Modal";

export interface WalletOption {
    name: string;
    chains: string[];
    connector: () => Promise<Wallet>;
}

export interface Wallet {
    signer: any;
    address: string;
    wallet: WalletOption;
}

const evmChains = [
    "Ethereum",
    "BinanceSmartChain",
    "Fantom",
    "Polygon",
    "Avalanche",
    "Goerli",
    "Arbitrum",
    "Catalog",
];

const metamaskOption: WalletOption = {
    name: "MetaMask",
    chains: [...evmChains],
    connector: async () => {
        await (window as any).ethereum.request({
            method: "eth_requestAccounts",
        });
        const web3Provider = new ethers.providers.Web3Provider(
            (window as any).ethereum,
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        // const networkId = signer.getChainId();

        return {
            signer,
            address,
            wallet: metamaskOption,
            // networkId,
        };
    },
};
const phantomOption: WalletOption = {
    name: "Phantom",
    chains: ["Solana"],
    connector: async () => {
        const solana = (window as any).solana as SolanaWallet;

        await solana.connect();

        if (!solana.publicKey) {
            throw new Error(`Invalid Solana public key.`);
        }
        const address = solana.publicKey.toString();

        return {
            signer: solana,
            address: address,
            wallet: phantomOption,
        };
    },
};

const walletOptions: WalletOption[] = [metamaskOption, phantomOption];

function useWalletContainerInner() {
    const [wallets, setWallets] = useState<Map<string, Wallet>>(Map());
    const [connecting, setConnecting] = useState<{
        chain: string;
        // network?: string | number;
        resolve: (wallet: Wallet) => void;
        reject: (error: Error) => void;
    }>();

    const resolve = useCallback(
        (wallet: Wallet) => {
            if (!connecting) {
                return;
            }
            setWallets((w) => w.set(connecting.chain, wallet));
            connecting.resolve(wallet);
            setConnecting(undefined);
        },
        [connecting],
    );

    const connect = useCallback(
        async ({
            chain,
        }: // network,
        {
            chain: string;
            network?: string | number;
        }) => {
            const existingWallet = wallets.get(chain);
            if (existingWallet) {
                return existingWallet;
            }

            if (connecting) {
                throw new Error(
                    `Already connecting ${connecting.chain} wallet.`,
                );
            }
            return new Promise<Wallet>((resolve, reject) => {
                setConnecting({
                    chain: chain,
                    // network,
                    resolve,
                    reject,
                });
            });
        },
        [wallets, connecting],
    );

    const disconnect = useCallback((chain: string) => {
        setWallets((w) => w.remove(chain));
    }, []);

    return {
        wallets,
        connect,
        disconnect,
        connecting,
        resolve,
    };
}

const WalletContainerInner = createContainer(useWalletContainerInner);

const WalletContainerModal: React.FC<{}> = () => {
    const {
        connecting: connectingNext,
        resolve,
        wallets,
    } = WalletContainerInner.useContainer();

    const [connecting, setConnecting] = useState(connectingNext);
    useEffect(() => {
        if (connectingNext) {
            setConnecting(connectingNext);
        }
    }, [connectingNext]);

    return (
        <Modal
            open={!!connectingNext}
            cancel={() => {
                connectingNext?.reject(new Error(`Cancelled.`));
            }}
            width="md"
        >
            {connecting ? (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        <ChainIcon
                            chainName={connecting.chain}
                            className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 sm:mx-0 sm:h-10 sm:w-10"
                            aria-hidden="true"
                        />
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <Dialog.Title
                                as="h3"
                                className="text-lg leading-6 font-medium text-gray-900"
                            >
                                Connect {connecting.chain} wallet
                            </Dialog.Title>
                            <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-2 sm:grid-cols-2">
                                {walletOptions
                                    .filter((option) =>
                                        option.chains.includes(
                                            connecting.chain,
                                        ),
                                    )
                                    .map((wallet) => (
                                        <li
                                            key={wallet.name}
                                            className="col-span-1 flex shadow-sm rounded-md cursor-pointer p-4 border border-gray-200 rounded-r-md items-center"
                                            onClick={async () => {
                                                resolve(
                                                    await wallet.connector(),
                                                );
                                            }}
                                        >
                                            <ChainIcon
                                                chainName={wallet.name}
                                                className="w-10 h-10"
                                            />
                                            <div className="flex-1 flex items-center justify-between truncate">
                                                <div className="flex-1 px-1 py-2 text-sm truncate">
                                                    <span className="text-gray-900 font-medium hover:text-gray-600">
                                                        {wallet.name}
                                                    </span>
                                                    <p className="text-gray-500">
                                                        {wallets
                                                            .valueSeq()
                                                            .find(
                                                                (w) =>
                                                                    w.wallet
                                                                        .name ===
                                                                    wallet.name,
                                                            )
                                                            ? "Connected"
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
};

export const WalletContainer = {
    Provider: ({ children }: { children?: React.ReactNode | undefined }) => (
        <WalletContainerInner.Provider>
            <WalletContainerModal />
            {children}
        </WalletContainerInner.Provider>
    ),
    useContainer: WalletContainerInner.useContainer,
};
