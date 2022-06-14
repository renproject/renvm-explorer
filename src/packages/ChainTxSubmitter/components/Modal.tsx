import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import React, { Fragment, PropsWithChildren } from "react";

import { classNames } from "../../../lib/utils";

interface Props {
    open: boolean;
    cancel: () => void;
    width?: "xs" | "sm" | "md" | "lg";
}

export const Modal: React.FC<PropsWithChildren<Props>> = ({
    open,
    cancel,
    width,
    children,
}) => {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={cancel}
            >
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
                        <div
                            className={classNames(
                                "inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full",
                                `sm:max-w-${width || "lg"}`,
                            )}
                        >
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="rounded-md text-white hover:text-gray-200"
                                    onClick={cancel}
                                >
                                    <span className="sr-only">Close</span>
                                    <XIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
