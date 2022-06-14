import { Gateway, GatewayTransaction } from "@renproject/ren";
import { OrderedMap } from "immutable";
import { useCallback, useEffect, useState } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { UIContainer } from "../../../containers/UIContainer";
import { NETWORK } from "../../../environmentVariables";
import { getGatewayInstance } from "../../../lib/searchGateway";
import { TransactionType } from "../../../lib/searchResult";
import { LoadAdditionalDetails } from "../TransactionPage/LoadAdditionalDetails";
import { RecipientRow } from "../TransactionPage/rows/RecipientRow";
import { SearchForDepositsToGateway } from "../TransactionPage/SearchForDepositsToGateway";
import { TransactionDiagram } from "../TransactionPage/TransactionDiagram";
import { TransactionError } from "../TransactionPage/TransactionError";
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
                    NETWORK,
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

    // return (
    //     <div className="mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    //         <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
    //             <div className="flex flex-col">
    //                 <div className="flex flex-col lg:flex-row lg:items-center justify-between px-4 w-full py-5">
    //                     <div className="">
    //                         <h3 className="text-lg leading-6 font-medium text-gray-900">
    //                             <span className="truncate">
    //                                 Gateway {address}
    //                             </span>
    //                         </h3>
    //                     </div>
    //                 </div>
    //             </div>

    //             <Card>
    //                 <Card.Body>
    //                     {queryGateway ? (
    //                         queryGateway instanceof Error ? (
    //                             <TransactionError
    //                                 txHash={gateway.address}
    //                                 error={queryGateway}
    //                             />
    //                         ) : (
    //                             <>
    //                                 <TransactionDiagram
    //                                     asset={queryGateway.summary.asset}
    //                                     to={queryGateway.summary.to}
    //                                     from={queryGateway.summary.from}
    //                                     amount={queryGateway.summary.amountIn}
    //                                 />

    //                                 <Table>
    //                                     <tbody>
    //                                         <tr>
    //                                             <td>Gateway Address</td>
    //                                             <td>{gateway.address}</td>
    //                                         </tr>
    //                                         <RecipientRow
    //                                             queryTx={queryGateway}
    //                                             deposit={lockAndMintInstance}
    //                                             legacy={false}
    //                                         />
    //                                     </tbody>
    //                                 </Table>

    //                                 <LoadAdditionalDetails
    //                                     legacy={false}
    //                                     gateway={true}
    //                                     queryTx={queryGateway}
    //                                     deposit={lockAndMintInstance}
    //                                     setLockAndMint={setLockAndMint}
    //                                 />
    //                                 <SearchForDepositsToGateway
    //                                     lockAndMint={lockAndMintInstance}
    //                                 />
    //                             </>
    //                         )
    //                     ) : (
    //                         <div>
    //                             <Spinner
    //                                 animation="border"
    //                                 role="status"
    //                                 variant="success"
    //                             ></Spinner>
    //                         </div>
    //                     )}
    //                 </Card.Body>
    //             </Card>
    //         </div>
    //     </div>
    // );
};
