import { Dialog, Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/outline";
import { ethers } from "ethers";
import React, { Fragment, useCallback, useRef, useState } from "react";

import { ReactComponent as MetaMaskLogo } from "../lib/chains/icons/wallets/metamask-white.svg";
import { classNames } from "../lib/utils";

interface Props {
    chain: string | null;
    close: () => void;
    setSigner: (signer: ethers.providers.JsonRpcSigner | undefined) => void;
}

const wallet = {
    name: "MetaMask",
    initials: "MM",
    bgColor: "bg-orange-500",
};

export const ConnectWallet: React.FC<Props> = ({ chain, close, setSigner }) => {
    const [open, setOpen] = useState(true);

    const cancelButtonRef = useRef(null);

    const connect = useCallback(async () => {
        await (window as any).ethereum.request({
            method: "eth_requestAccounts",
        });
        const web3Provider = new ethers.providers.Web3Provider(
            (window as any).ethereum,
        );
        setSigner(web3Provider.getSigner());
        close();
    }, [setSigner]);

    return (
        <Transition.Root show={chain !== null} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <CreditCardIcon
                                            className="h-6 w-6 text-green-600"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg leading-6 font-medium text-gray-900"
                                        >
                                            Connect {chain} wallet
                                        </Dialog.Title>
                                        <ul className="mt-3 grid grid-cols-1 gap-5 sm:gap-2 sm:grid-cols-2">
                                            <li
                                                key={wallet.name}
                                                className="col-span-1 flex shadow-sm rounded-md cursor-pointer"
                                                onClick={connect}
                                            >
                                                <div
                                                    className={classNames(
                                                        wallet.bgColor,
                                                        "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md",
                                                    )}
                                                >
                                                    <MetaMaskLogo className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                                                    <div className="flex-1 px-4 py-2 text-sm truncate">
                                                        <span className="text-gray-900 font-medium hover:text-gray-600">
                                                            {wallet.name}
                                                        </span>
                                                        <p className="text-gray-500">
                                                            Detected
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={close}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
