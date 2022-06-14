import { Gateway, GatewayTransaction } from "@renproject/ren";
import { Chain } from "@renproject/utils";
import React from "react";

import {
    SummarizedTransaction,
    TransactionType,
} from "../../../../lib/searchResult";
import { MaybeLink } from "../../../common/MaybeLink";

interface Props {
    queryTx: SummarizedTransaction;
    deposit: Gateway | GatewayTransaction | Error | undefined | null;
    legacy: boolean;
}

export const RecipientRow: React.FC<Props> = ({ queryTx, deposit, legacy }) => {
    const toChain: Chain =
        deposit && !(deposit instanceof Error)
            ? deposit.params.to
            : queryTx.summary.toChain;

    return queryTx.transactionType === TransactionType.Mint ? (
        <>
            <tr>
                <td>Recipient</td>
                <td>
                    <MaybeLink
                        href={
                            toChain
                                ? toChain.addressExplorerLink(
                                      queryTx.result.in.to.toString(),
                                  )
                                : undefined
                        }
                        noUnderline
                    >
                        {queryTx.result.in.to.toString()}
                    </MaybeLink>
                    {/* {deposit &&
          !(deposit instanceof Error) &&
          deposit.params.contractCalls ? (
            <>
              <Table style={{ marginTop: 20 }}>
                <tbody>
                  <tr>
                    <td>Function</td>
                    <td colSpan={3}>
                      {
                        deposit.params.contractCalls[
                          deposit.params.contractCalls.length - 1
                        ].contractFn
                      }
                    </td>
                  </tr>
                  {deposit.params.contractCalls[
                    deposit.params.contractCalls.length - 1
                  ].contractParams?.map((param, i) => {
                    return (
                      <tr
                        key={i}
                        style={{
                          opacity:
                            param.onlyInPayload || param.notInPayload ? 0.5 : 1,
                        }}
                      >
                        <td>Param {i + 1}</td>
                        <td>{param.name}</td>
                        <td>{param.type}</td>
                        <td>
                          {param.type === "address" &&
                          deposit.params.to.utils.addressExplorerLink ? (
                            <ExternalLink
                              href={deposit.params.to.utils.addressExplorerLink(
                                param.value,
                                NETWORK
                              )}
                            >
                              {param.value.toString()}
                            </ExternalLink>
                          ) : (
                            param.value.toString()
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <p></p>
            </>
          ) : null} */}
                </td>
            </tr>
        </>
    ) : queryTx.result.in.to ? (
        <tr>
            <td>Recipient</td>
            <td>
                <MaybeLink
                    href={
                        toChain
                            ? toChain.addressExplorerLink(
                                  legacy
                                      ? Buffer.from(
                                            queryTx.result.in.to,
                                            "base64",
                                        ).toString()
                                      : queryTx.result.in.to.toString(),
                              )
                            : undefined
                    }
                >
                    {legacy
                        ? Buffer.from(queryTx.result.in.to, "base64").toString()
                        : queryTx.result.in.to.toString()}
                </MaybeLink>
            </td>
        </tr>
    ) : null;
};
