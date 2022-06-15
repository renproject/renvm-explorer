import { Gateway, GatewayTransaction } from "@renproject/ren";
import { OrderedMap } from "immutable";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { getGatewayInstance } from "../../../lib/searchGateway";
import { TransactionType } from "../../../lib/searchResult";
import { GatewayTable } from "./GatewayTable";

export const GatewayPage = () => {
    const { gateway, handleGatewayURL } = UIContainer.useContainer();

    const { address } = useParams<{ address: string }>();

    useEffect(() => {
        if (!address) {
            return;
        }
        handleGatewayURL(address);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    // useEffect(() => {
    //     window.location.replace(
    //         `https://renproject.github.io/renvm-explorer-legacy/#/gateway/${address}`,
    //     );
    // });

    const queryGateway =
        gateway && !(gateway instanceof Error) && gateway.queryGateway;

    const [gatewayInstance, setGatewayInstance] = useState<
        Gateway | Error | null | undefined
    >(undefined);

    const [deposits, setDeposits] = useState(
        OrderedMap<string, GatewayTransaction>(),
    );

    const onDeposit = useCallback(
        (deposit: GatewayTransaction) => {
            const txHash = deposit.hash;
            // deposit.signed();
            setDeposits((deposits) => deposits.set(txHash, deposit));
            deposit.renVM.submit().catch(console.error);
        },
        [setDeposits],
    );

    const { renJS } = UIContainer.useContainer();

    const loadAdditionalDetails = useCallback(async () => {
        if (
            queryGateway &&
            !(queryGateway instanceof Error) &&
            queryGateway.transactionType === TransactionType.Mint
        ) {
            setGatewayInstance(undefined);
            try {
                const deposit = await getGatewayInstance(
                    renJS,
                    queryGateway.result,
                    queryGateway.summary,
                );
                setGatewayInstance(deposit);
                deposit.on("transaction", onDeposit);
            } catch (error: any) {
                console.error(error);
                setGatewayInstance(
                    error instanceof Error ? error : new Error(error),
                );
            }
        }
    }, [renJS, queryGateway, setGatewayInstance, onDeposit]);

    if (!address) {
        return <div>No address provided.</div>;
    }

    return (
        <>
            <GatewayTable
                address={address}
                loadAdditionalDetails={
                    queryGateway &&
                    !(queryGateway instanceof Error) &&
                    queryGateway.transactionType === TransactionType.Mint
                        ? loadAdditionalDetails
                        : undefined
                }
                error={
                    gateway instanceof Error
                        ? gateway
                        : gateway?.queryGateway instanceof Error
                        ? gateway.queryGateway
                        : undefined
                }
                details={
                    queryGateway && queryGateway.summary
                        ? {
                              asset: queryGateway.summary.asset,
                              from: queryGateway.summary.from,
                              to: queryGateway.summary.to,
                              decimals: queryGateway.summary.decimals,
                              queryGateway,
                              gatewayInstance:
                                  gatewayInstance &&
                                  !(gatewayInstance instanceof Error)
                                      ? gatewayInstance
                                      : undefined,
                              deposits: deposits.valueSeq().toArray(),
                          }
                        : undefined
                }
            />
        </>
    );
};
