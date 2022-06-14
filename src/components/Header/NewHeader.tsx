import { Popover, Transition } from "@headlessui/react";
import { LinkIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { RenNetwork } from "@renproject/utils";
/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";

import { NETWORK } from "../../environmentVariables";
import { ReactComponent as Logo } from "../../images/logo.svg";
import { classNames } from "../../lib/utils";
import { ExternalLink } from "../common/ExternalLink";

const links = [
    {
        name: "renproject.io",
        description: "Powering the multichain.",
        icon: LinkIcon,
        href: "https://renproject.io",
    },
    {
        name: "RenBridge",
        description:
            "The official Ren app for bridging cross-chain assets between blockchains.",
        icon: LinkIcon,
        href: "https://bridge.renproject.io",
    },
    {
        name: "Command Center",
        description:
            "A dashboard for seeing RenVM stats and for darknode operators.",
        icon: LinkIcon,
        href: "https://mainnet.renproject.io",
    },
    {
        name: "Protocol Docs",
        description:
            "Technical documentation for learning about how RenVM works.",
        icon: LinkIcon,
        href: "https://github.com/renproject/ren/wiki",
    },
    {
        name: "RenJS Docs",
        description:
            "Technical documentation for integrating with Ren's SDK and contracts.",
        icon: LinkIcon,
        href: "https://renproject.github.io/ren-client-docs",
    },
    {
        name: "Report bug or issue",
        description:
            "Report an issue you've run into using any of Ren's websites or services.",
        icon: LinkIcon,
        href: "https://renprotocol.typeform.com/to/YdmFyB",
    },
];

export function NewHeader() {
    return (
        <Popover className="relative bg-white border-b-2 border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
                    <a href="/">
                        <div className="flex items-center justify-start lg:flex-1">
                            <Logo className="h-8 w-auto sm:h-10 pr-2" />
                            <div className="text-gray-800 flex flex-col">
                                <div>
                                    <span className="font-semibold">RenVM</span>{" "}
                                    <span className="font-light">Explorer</span>
                                </div>
                                {NETWORK === RenNetwork.Mainnet ? (
                                    <></>
                                ) : (
                                    <span className="uppercase text-xs p-1 px-2 border rounded-lg w-fit">
                                        {NETWORK}
                                    </span>
                                )}
                            </div>
                        </div>
                    </a>
                    <div className="-mr-2 -my-2 md:hidden">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-renblue-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <Popover.Group
                        as="nav"
                        className="hidden md:flex space-x-10"
                    >
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open
                                                ? "text-gray-900"
                                                : "text-gray-500",
                                            "group bg-white rounded-md inline-flex items-center text-base font-light hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-renblue-500",
                                        )}
                                    >
                                        <span>Links</span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open
                                                    ? "text-gray-600"
                                                    : "text-gray-400",
                                                "ml-2 h-5 w-5 group-hover:text-gray-500",
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md sm:px-0">
                                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                                <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                                    {links.map((item) => (
                                                        <a
                                                            key={item.name}
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                                                        >
                                                            <item.icon
                                                                className="flex-shrink-0 h-6 w-6 text-renblue-600"
                                                                aria-hidden="true"
                                                            />
                                                            <div className="ml-4">
                                                                <p className="text-base font-medium text-gray-900">
                                                                    {item.name}
                                                                </p>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </Popover.Group>
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                        <ExternalLink
                            noUnderline
                            href="https://bridge.renproject.io"
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-renblue-600 hover:bg-renblue-700"
                        >
                            Go to RenBridge
                        </ExternalLink>
                    </div>
                </div>
            </div>

            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                >
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        <div className="pt-5 pb-6 px-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Logo className="h-8 w-auto" />
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-renblue-500">
                                        <span className="sr-only">
                                            Close menu
                                        </span>
                                        <XIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </div>
                            </div>
                            {/* <div className="mt-6">
                                <nav className="grid gap-y-8">
                                    {solutions.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                                        >
                                            <item.icon
                                                className="flex-shrink-0 h-6 w-6 text-renblue-600"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-3 text-base font-medium text-gray-900">
                                                {item.name}
                                            </span>
                                        </a>
                                    ))}
                                </nav>
                            </div> */}
                        </div>
                        <div className="py-6 px-5 space-y-6">
                            {/* <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <a
                                    href="#"
                                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                                >
                                    Pricing
                                </a>

                                <a
                                    href="#"
                                    className="text-base font-medium text-gray-900 hover:text-gray-700"
                                >
                                    Docs
                                </a>
                                {resources.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-base font-medium text-gray-900 hover:text-gray-700"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div> */}
                            <div>
                                <ExternalLink
                                    noUnderline
                                    href="https://bridge.renproject.io"
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-renblue-600 hover:bg-renblue-700"
                                >
                                    Go to RenBridge
                                </ExternalLink>
                                {/* <p className="mt-6 text-center text-base font-medium text-gray-500">
                                    Existing customer?{" "}
                                    <a
                                        href="#"
                                        className="text-renblue-600 hover:text-renblue-500"
                                    >
                                        Sign in
                                    </a>
                                </p> */}
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}
