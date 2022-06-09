import {
    CursorClickIcon,
    LinkIcon,
    MailOpenIcon,
    UsersIcon,
} from "@heroicons/react/outline";
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LatestTransactions } from "../../LatestTransactions/LatestTransactions";
import { SearchForm } from "../../SearchForm/SearchForm";

const stats = [
    {
        id: 1,
        name: "Chains Supported",
        stat: "15",
        icon: LinkIcon,
    },
    {
        id: 2,
        name: "24 Hour Volume",
        stat: "$1 203 000",
        icon: MailOpenIcon,
        change: "10.1%",
        changeType: "increase",
    },
    {
        id: 3,
        name: "24 Hour Transaction Count",
        stat: "123",
        icon: CursorClickIcon,
        change: "3.2%",
        changeType: "decrease",
    },
];

export const Homepage = () => {
    const { hash } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (hash) {
            navigate(hash.replace(/^#\/?/, ""));
        }
    }, [navigate, hash]);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <SearchForm />
            {/* <div>
                <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {stats.map((item) => (
                        <div
                            key={item.id}
                            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <dt>
                                <div className="absolute bg-renblue-500 rounded-md p-3">
                                    <item.icon
                                        className="h-6 w-6 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                                    {item.name}
                                </p>
                            </dt>
                            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {item.stat}
                                </p>
                                <p
                                    className={classNames(
                                        item.changeType === "increase"
                                            ? "text-green-600"
                                            : "text-red-600",
                                        "ml-2 flex items-baseline text-sm font-semibold",
                                    )}
                                >
                                    {item.changeType === "increase" ? (
                                        <ArrowSmUpIcon
                                            className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                                            aria-hidden="true"
                                        />
                                    ) : item.changeType === "decrease" ? (
                                        <ArrowSmDownIcon
                                            className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                                            aria-hidden="true"
                                        />
                                    ) : null}

                                    <span className="sr-only">
                                        {item.changeType === "increase"
                                            ? "Increased"
                                            : item.changeType === "decrease"
                                            ? "Decreased"
                                            : ""}{" "}
                                        by
                                    </span>
                                    {item.change}
                                </p>
                                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                                    <div className="text-sm">
                                        <a
                                            href="#"
                                            className="font-medium text-renblue-600 hover:text-renblue-500"
                                        >
                                            {" "}
                                            View all
                                            <span className="sr-only">
                                                {" "}
                                                {item.name} stats
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div> */}
            <br />
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-1 lg:gap-8">
                {/* <LatestTransactions title={"Largest Transactions (24H)"} /> */}
                <LatestTransactions title={"Latest transactions"} />
            </div>
        </div>
    );
};
