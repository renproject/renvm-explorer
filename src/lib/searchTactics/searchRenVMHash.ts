import { Ethereum } from "@renproject/chains-ethereum";
import {
    RenVMCrossChainTransaction,
    RenVMProvider,
    ResponseQueryTx,
    RPCMethod,
    unmarshalRenVMTransaction,
} from "@renproject/provider";
import RenJS from "@renproject/ren";
import { Chain, isEmptySignature, RenNetwork } from "@renproject/utils";
import BigNumber from "bignumber.js";

import { NETWORK } from "../../environmentVariables";
import {
    RenVMTransaction,
    RenVMTransactionError,
    SummarizedTransaction,
    TransactionSummary,
    TransactionType,
} from "../searchResult";
import { errorMatches, TaggedError } from "../taggedError";
import { unmarshalClaimFeesTx } from "../unmarshalClaimFees";
import { isURLBase64 } from "./common";
import { SearchTactic } from "./searchTactic";

const RenVMChain = "RenVM";

const parseV2Selector = (selector: string) => {
    const maybeClaimFees = /(.*)\/claimFees/.exec(selector);
    if (maybeClaimFees) {
        const asset = maybeClaimFees[1];
        return {
            asset,
            from: RenVMChain,
            to: asset,
        };
    }

    const regex =
        // Regular Expression to match selectors in the form of
        // ASSET/fromCHAINtoCHAIN, ASSET/fromCHAIN or ASSET/toCHAIN.
        // ^(  ASSET )/[      [from(        CHAIN      ) _   to(   CHAIN  )] OR [from( CHAIN )] OR ( to(  CHAIN  ))]$
        /^([a-zA-Z_]+)\/(?:(?:(?:from([a-zA-Z]+?(?=_to)))_(?:to([a-zA-Z]+))?)|(?:from([a-zA-Z]+))|(?:to([a-zA-Z]+)))$/;
    const match = regex.exec(selector);
    if (!match) {
        throw new Error(`Invalid selector format '${selector}'.`);
    }
    const [, asset, burnAndMintFrom, burnAndMintTo, burnFrom, mintTo] = match;

    return {
        asset,
        from: burnAndMintFrom || burnFrom || asset,
        to: burnAndMintTo || mintTo || asset,
    };
};

const getChainLabel = (
    chain: string,
    network: RenNetwork,
): { short: string; full: string } => {
    if (chain === "BinanceSmartChain") {
        return { short: "BSC", full: "Binance Smart Chain" };
    } else if (chain === "Ethereum" && network === RenNetwork.Testnet) {
        return { full: "Kovan", short: "Kovan" };
    } else if (chain === "Goerli") {
        return { full: "Görli", short: "Görli" };
    } else {
        return { full: chain, short: chain };
    }
};

export const summarizeTransaction = async (
    searchDetails: RenVMCrossChainTransaction,
    getChain: (chainName: string) => Chain | null,
): Promise<TransactionSummary> => {
    let { to, from, asset } = parseV2Selector(searchDetails.selector);

    const fromChain = getChain(from);
    from = fromChain ? fromChain.chain : from;
    const toChain = getChain(to);
    to = toChain ? toChain.chain : to;

    let amountInRaw: BigNumber | undefined;
    let amountIn: BigNumber | undefined;
    let amountOutRaw: BigNumber | undefined;
    let amountOut: BigNumber | undefined;
    let decimals: number | undefined;

    if (
        (searchDetails.in as any).amount &&
        !(searchDetails.in as any).amount.isNaN()
    ) {
        amountInRaw = new BigNumber((searchDetails.in as any).amount);
    }

    let chain;
    if (fromChain && (await fromChain.isLockAsset(asset))) {
        chain = fromChain;
    } else {
        chain = toChain;
    }

    try {
        if (amountInRaw && chain) {
            decimals = await chain.assetDecimals(asset);
            amountIn = amountInRaw.shiftedBy(-decimals);
            if (
                searchDetails.out &&
                (searchDetails.out.revert === undefined ||
                    searchDetails.out.revert.length === 0) &&
                (searchDetails.out as any).amount
            ) {
                amountOutRaw = new BigNumber((searchDetails.out as any).amount);
                amountOut = amountOutRaw.shiftedBy(-decimals);
            }
        }
    } catch (error) {
        console.error(error);
        // Ignore error.
    }

    let outTx:
        | {
              txHash: string;
              explorerLink: string;
          }
        | undefined;
    if (
        toChain &&
        searchDetails.out &&
        searchDetails.out.txid?.length > 0 &&
        // Check that the transaction is a release - signature is empty.
        (!searchDetails.out.sig || isEmptySignature(searchDetails.out.sig))
    ) {
        const outTxHash = toChain.txHashFromBytes(searchDetails.out?.txid);
        outTx = {
            txHash: outTxHash,
            explorerLink:
                toChain.transactionExplorerLink({
                    txHash: outTxHash,
                    txindex: searchDetails.out.txindex.toFixed(),
                }) || "",
        };
    }

    let inTx:
        | {
              txHash: string;
              explorerLink: string;
          }
        | undefined;
    if (
        fromChain &&
        searchDetails.in?.txid &&
        searchDetails.in?.txid.length > 0
    ) {
        const inTxHash = fromChain.txHashFromBytes(searchDetails.in?.txid);
        inTx = {
            txHash: inTxHash,
            explorerLink:
                fromChain.transactionExplorerLink({
                    txHash: inTxHash,
                    txindex: searchDetails.in.txindex.toFixed(),
                }) || "",
        };
    }

    let [_, assetShort, assetOriginChain] =
        asset.match(/([^_]*)(?:_(.*))?/) ||
        ([undefined, asset, undefined] as [undefined, string, undefined]);
    if (
        NETWORK === RenNetwork.Testnet &&
        !assetOriginChain &&
        (Object.values(Ethereum.assets) as string[]).includes(asset)
    ) {
        assetOriginChain = "Kovan";
    }
    const assetLabel = assetOriginChain
        ? `${getChainLabel(assetOriginChain, NETWORK).short} ${assetShort}`
        : asset;

    const { full: toLabel, short: toLabelShort } = getChainLabel(to, NETWORK);
    const { full: fromLabel, short: fromLabelShort } = getChainLabel(
        from,
        NETWORK,
    );

    return {
        asset,
        assetLabel,
        assetShort,
        to,
        toLabel,
        toLabelShort,
        toChain: toChain || undefined,

        from,
        fromLabel,
        fromLabelShort,
        fromChain: fromChain || undefined,

        decimals,
        amountIn,
        amountInRaw,

        amountOut,
        amountOutRaw,

        outTx,
        inTx,
    };
};

export const unmarshalTransaction = async (
    response:
        | ResponseQueryTx
        | { tx: ResponseQueryTx["tx"]; txStatus: undefined },
    getChain: (chainName: string) => Chain | null,
): Promise<SummarizedTransaction> => {
    const isMint = /((\/to)|(To))/.exec(response.tx.selector);
    const isBurn = /((\/from)|(From))/.exec(response.tx.selector);
    const isClaim = /\/claimFees/.exec(response.tx.selector);

    // Unmarshal transaction.
    if (isClaim) {
        const unmarshalled = unmarshalClaimFeesTx(response);
        return {
            result: unmarshalled,
            transactionType: TransactionType.ClaimFees as const,
            summary: await summarizeTransaction(unmarshalled, getChain),
        };
    } else if (isMint || isBurn) {
        const unmarshalled = unmarshalRenVMTransaction(response.tx);
        return {
            result: { ...unmarshalled, status: response.txStatus },
            transactionType: TransactionType.Mint as const,
            summary: await summarizeTransaction(unmarshalled, getChain),
        };
    } else {
        throw new Error(
            `Unrecognised transaction type ${response.tx.selector}.`,
        );
    }
};

export const queryMintOrBurn = async (
    provider: RenVMProvider,
    transactionHash: string,
    getChain: (chainName: string) => Chain | null,
): Promise<SummarizedTransaction> => {
    let response: ResponseQueryTx;
    try {
        response = await provider.sendMessage(RPCMethod.QueryTx, {
            txHash: transactionHash,
        });
    } catch (error: any) {
        if (errorMatches(error, "not found")) {
            throw new TaggedError(
                error,
                RenVMTransactionError.TransactionNotFound,
            );
        }
        throw error;
    }

    return unmarshalTransaction(response, getChain);
};

export const searchRenVMHash: SearchTactic<RenVMTransaction> = {
    match: (searchString: string) =>
        isURLBase64(searchString, {
            length: 32,
        }),

    search: async (
        searchString: string,
        updateStatus: (status: string) => void,
        getChain: (chainName: string) => Chain | null,
        renJS: RenJS,
    ): Promise<RenVMTransaction> => {
        updateStatus("Looking up RenVM hash...");

        let queryTx = await queryMintOrBurn(
            renJS.provider,
            searchString,
            getChain,
        );

        return RenVMTransaction(searchString, queryTx);
    },
};
