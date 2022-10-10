import { MintToTokenAddress } from "@renproject/chains";
import { EVMAddressPayload } from "@renproject/chains-ethereum/utils/payloads/evmAddressPayload";
import { EVMContractPayload } from "@renproject/chains-ethereum/utils/payloads/evmContractPayload";
import { Chain } from "@renproject/utils";
import { ethers } from "ethers";
import React, { PropsWithChildren } from "react";

import { classNames } from "../../../lib/utils";
import { ExternalLink } from "../../common/ExternalLink";

export const TableRow: React.FC<
    PropsWithChildren & { title: React.ReactNode; className?: string }
> = ({ title, children, className }) => (
    <div
        className={classNames("p-2 sm:grid sm:grid-cols-4 sm:gap-4", className)}
    >
        <dt className="text-sm font-medium text-gray-500 flex items-center">
            {title}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3 truncate">
            {children}
        </dd>
    </div>
);

export const Divider: React.FC = () => (
    <svg
        className="flex-shrink-0 h-5 w-5 text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
);

export const RenderPayload: React.FC<{
    chain: Chain;
    payload: {
        chain: string;
        txConfig?: any;
        type?: string;
    };
}> = ({ chain, payload }) => {
    switch (payload.type) {
        case "mintToAddress":
        case "mintToTokenAddress":
            return (
                <ExternalLink
                    href={chain.addressExplorerLink(
                        (payload as MintToTokenAddress).params.to,
                    )}
                >
                    {(payload as MintToTokenAddress).params.to}
                </ExternalLink>
            );
        case "address":
            return (
                <ExternalLink
                    href={chain.addressExplorerLink(
                        (payload as EVMAddressPayload).params.address,
                    )}
                >
                    {(payload as EVMAddressPayload).params.address}
                </ExternalLink>
            );
        case "contract": // EVM contract
            let params = (payload as EVMContractPayload).params.params;
            if (
                params[params.length - 3].name === "amount" &&
                params[params.length - 2].name === "nHash" &&
                params[params.length - 1].name === "signature"
            ) {
                params = params.slice(0, params.length - 3);
            }
            return (
                <>
                    <div className="sm:rounded-lg border border-gray-200">
                        <div className="border-b p-2 sm:rounded-t-lg">
                            <div className="flex">
                                <div className="flex items-center font-bold">
                                    Contract
                                </div>
                                <Divider />
                                <ExternalLink
                                    href={chain.addressExplorerLink(
                                        (payload as EVMContractPayload).params
                                            .to,
                                    )}
                                    noArrow={true}
                                    noUnderline={true}
                                >
                                    {(payload as EVMContractPayload).params.to}
                                </ExternalLink>
                                <Divider />
                                <div className="italic">
                                    {
                                        (payload as EVMContractPayload).params
                                            .method
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            {params.map((param, index) => {
                                const href =
                                    param.type === "address" &&
                                    param.value.slice(0, 6) !== "__EVM_"
                                        ? chain.addressExplorerLink(param.value)
                                        : undefined;
                                return (
                                    <TableRow
                                        key={param.name}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-gray-50"
                                        }
                                        title={
                                            <span className="italic truncate">
                                                {param.name}
                                            </span>
                                        }
                                    >
                                        <span className="font-mono">
                                            {href ? (
                                                <ExternalLink href={href}>
                                                    {param.value}
                                                </ExternalLink>
                                            ) : ethers.BigNumber.isBigNumber(
                                                  param.value,
                                              ) ? (
                                                param.value.toString()
                                            ) : (
                                                JSON.stringify(param.value)
                                            )}
                                        </span>
                                    </TableRow>
                                );
                            })}
                        </div>
                    </div>
                </>
            );
        default:
            return (
                <span className="font-mono">
                    <span className="opacity-30">
                        {JSON.stringify(payload)}
                    </span>
                </span>
            );
    }
};
