import RenJS from "@renproject/ren";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContainer } from "unstated-next";

import { LIGHTNODE, NETWORK } from "../environmentVariables";
import { allChains, ChainMapper } from "../lib/chains/chains";
import { search, SearchErrors } from "../lib/search";
import { searchGateway } from "../lib/searchGateway";
import {
    LegacyRenVMTransaction,
    RenVMGateway,
    RenVMTransaction,
    Searching,
    SearchResult,
} from "../lib/searchResult";
import { searchTransaction } from "../lib/searchTransaction";
import { TaggedError } from "../lib/taggedError";

function useUIContainer() {
    const navigate = useNavigate();

    const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

    const [transaction, setTransaction] = useState<
        RenVMTransaction | LegacyRenVMTransaction | null | Error
    >(null);
    const [gateway, setGateway] = useState<RenVMGateway | null | Error>(null);
    const [updatedCount, setUpdatedCount] = useState(0);

    const renJS = useMemo(() => {
        return new RenJS(LIGHTNODE);
    }, []);

    const getChainDetails = useCallback((chainName: string) => {
        for (const chain of allChains) {
            if (
                chain.chainPattern.exec(chainName) ||
                Object.values(chain.assets).includes(chainName)
            ) {
                return chain;
            }
        }
        return null;
    }, []);

    const getChain = useCallback(
        (chain: string) => {
            const chainName = getChainDetails(chain)?.chain || chain;

            const chains = renJS.chains;

            const chainDetails = getChainDetails(chain);

            const existingChain =
                chains[chainName] ||
                (chainDetails && chains[chainDetails.chain]);
            Object.values(chains).find((chain) =>
                Object.values(chain?.assets || {}).includes(chainName),
            );
            if (existingChain) {
                return existingChain;
            }

            if (!chainDetails) {
                return null;
            }

            try {
                const chain = ChainMapper(chainDetails.chain, NETWORK);
                if (chain) {
                    renJS.withChain(chain);
                }
                return chain;
            } catch (error: any) {
                console.error(error);
                return null;
            }
        },
        [renJS, getChainDetails],
    );

    // handleSearchURL is called when the search parameter in the URL changes.
    const handleSearchURL = useCallback(
        (encodedSearchInput: string) => {
            setSearchResult(null);
            const searchInput = decodeURIComponent(encodedSearchInput);

            setSearchResult(Searching(searchInput));

            search(searchInput, console.log, getChain, renJS)
                .then((result) => {
                    if (result && Array.isArray(result)) {
                        if (result.length === 0) {
                            setSearchResult(
                                Searching(searchInput, { noResult: true }),
                            );
                            setUpdatedCount((count) => count + 1);
                            return;
                        } else if (result.length === 1) {
                            result = result[0];
                        } else {
                            setSearchResult(
                                Searching(searchInput, {
                                    multipleResults: result,
                                }),
                            );
                            setUpdatedCount((count) => count + 1);
                            return;
                        }
                    }

                    if (result.resultPath.match(/^https:\/\//)) {
                        window.location.replace(result.resultPath);
                    } else {
                        setSearchResult(result);
                        navigate(result.resultPath, { replace: false });
                    }
                })
                .catch((error) => {
                    if (
                        (error as TaggedError)._tag === SearchErrors.NO_RESULTS
                    ) {
                        setSearchResult(
                            Searching(searchInput, { noResult: true }),
                        );
                        setUpdatedCount((count) => count + 1);
                    } else {
                        setSearchResult(
                            Searching(searchInput, { errorSearching: error }),
                        );
                        setUpdatedCount((count) => count + 1);
                    }
                });
        },
        [navigate, getChain, renJS],
    );

    // handleSearchForm is called when the user submits a new search.
    const handleSearchForm = useCallback(
        (searchInput: string) => {
            // Update current path, using `push` instead of `replace` to create
            // a new history entry.
            // Changing the path will trigger `handleSearchURL` to be called.
            const encodedSearchInput = encodeURIComponent(searchInput);
            navigate(`/search/` + encodedSearchInput);
        },
        [navigate],
    );

    const handleTransactionURL = useCallback(
        (encodedTransactionInput: string) => {
            const transactionInput = decodeURIComponent(
                encodedTransactionInput,
            );

            let transaction: RenVMTransaction =
                RenVMTransaction(transactionInput);
            if (
                searchResult &&
                !Array.isArray(searchResult) &&
                searchResult.resultPath === transaction.resultPath
            ) {
                transaction = searchResult as RenVMTransaction;
            }

            setTransaction(transaction);

            searchTransaction(transaction, getChain, renJS)
                .then((transaction) => {
                    setTransaction(transaction);
                    setUpdatedCount((count) => count + 1);
                })
                .catch((error) =>
                    setTransaction({
                        ...transaction,
                        queryTx: error,
                    }),
                );
        },
        [searchResult, setTransaction, getChain, renJS],
    );

    const handleGatewayURL = useCallback(
        (encodedGatewayInput: string) => {
            const gatewayInput = decodeURIComponent(encodedGatewayInput);

            let gateway: RenVMGateway = RenVMGateway(gatewayInput);
            if (
                searchResult &&
                !Array.isArray(searchResult) &&
                searchResult.resultPath === gateway.resultPath
            ) {
                gateway = searchResult as RenVMGateway;
            }

            setGateway(gateway);
            setUpdatedCount((count) => count + 1);

            searchGateway(gateway, getChain, renJS)
                .then((gateway) => {
                    setGateway(gateway);
                    setUpdatedCount((count) => count + 1);
                })
                .catch((error) =>
                    setGateway({
                        ...gateway,
                        queryGateway: error,
                    }),
                );
        },
        [searchResult, getChain, renJS],
    );

    return {
        renJS,
        searchResult,
        transaction,
        gateway,
        updatedCount,
        setSearchResult,
        handleSearchURL,
        handleSearchForm,
        handleTransactionURL,
        handleGatewayURL,
        getChainDetails,
        getChain,
    };
}

export const UIContainer = createContainer(useUIContainer);
