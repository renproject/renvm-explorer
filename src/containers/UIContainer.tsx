import { OrderedMap } from "immutable";
import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { createContainer } from "unstated-next";

import { ChainCommon } from "@renproject/interfaces";

import { NETWORK } from "../environmentVariables";
import { allChains, ChainMapper } from "../lib/chains/chains";
import { search, SearchErrors } from "../lib/search";
import { searchGateway } from "../lib/searchGateway";
import { searchLegacyTransaction } from "../lib/searchLegacyTransaction";
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
  const history = useHistory();

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const [transaction, setTransaction] = useState<
    RenVMTransaction | LegacyRenVMTransaction | null | Error
  >(null);
  const [gateway, setGateway] = useState<RenVMGateway | null | Error>(null);
  const [updatedCount, setUpdatedCount] = useState(0);

  const chains = useMemo(() => {
    return allChains.reduce((acc, chainDetails) => {
      try {
        const chain = ChainMapper(chainDetails.chain, NETWORK);
        chain?.initialize(NETWORK);
        return acc.set(chainDetails.chain, chain || null);
      } catch (error: any) {
        console.error(error);
        return acc.set(chainDetails.chain, null);
      }
    }, OrderedMap<string, ChainCommon | null>());
  }, []);

  const getChainDetails = useCallback((chainName: string) => {
    for (const chain of allChains) {
      if (chain.chainPattern.exec(chainName)) {
        return chain;
      }
    }
    return null;
  }, []);

  const getChain = useCallback(
    (chainName: string) => {
      const chainDetails = getChainDetails(chainName);
      return chainDetails ? chains.get(chainDetails.chain, null) : null;
    },
    [chains, getChainDetails]
  );

  // handleSearchURL is called when the search parameter in the URL changes.
  const handleSearchURL = useCallback(
    (encodedSearchInput) => {
      setSearchResult(null);
      const searchInput = decodeURIComponent(encodedSearchInput);

      setSearchResult(Searching(searchInput));

      search(searchInput, console.log, getChain)
        .then((result) => {
          if (result && Array.isArray(result)) {
            if (result.length === 0) {
              setSearchResult(Searching(searchInput, { noResult: true }));
              setUpdatedCount((count) => count + 1);
              return;
            } else if (result.length === 1) {
              result = result[0];
            } else {
              setSearchResult(
                Searching(searchInput, { multipleResults: result })
              );
              setUpdatedCount((count) => count + 1);
              return;
            }
          }

          setSearchResult(result);
          history.replace(result.resultPath);
        })
        .catch((error) => {
          if ((error as TaggedError)._tag === SearchErrors.NO_RESULTS) {
            setSearchResult(Searching(searchInput, { noResult: true }));
            setUpdatedCount((count) => count + 1);
          } else {
            setSearchResult(Searching(searchInput, { errorSearching: error }));
            setUpdatedCount((count) => count + 1);
          }
        });
    },
    [history, getChain]
  );

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      setSearchResult(result);
      history.replace(result.resultPath);
    },
    [history]
  );

  // handleSearchForm is called when the user submits a new search.
  const handleSearchForm = useCallback(
    (searchInput: string) => {
      // Update current path, using `push` instead of `replace` to create
      // a new history entry.
      // Changing the path will trigger `handleSearchURL` to be called.
      const encodedSearchInput = encodeURIComponent(searchInput);
      history.push(`/search/` + encodedSearchInput);
    },
    [history]
  );

  const handleTransactionURL = useCallback(
    (encodedTransactionInput) => {
      const transactionInput = decodeURIComponent(encodedTransactionInput);

      let transaction: RenVMTransaction = RenVMTransaction(transactionInput);
      if (
        searchResult &&
        !Array.isArray(searchResult) &&
        searchResult.resultPath === transaction.resultPath
      ) {
        transaction = searchResult as RenVMTransaction;
      }

      setTransaction(transaction);

      searchTransaction(transaction, getChain)
        .then((transaction) => {
          setTransaction(transaction);
          setUpdatedCount((count) => count + 1);
        })
        .catch((error) =>
          setTransaction({
            ...transaction,
            queryTx: error,
          })
        );
    },
    [searchResult, setTransaction, getChain]
  );

  const handleGatewayURL = useCallback(
    (encodedGatewayInput) => {
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

      searchGateway(gateway, getChain)
        .then((gateway) => {
          setGateway(gateway);
          setUpdatedCount((count) => count + 1);
        })
        .catch((error) =>
          setGateway({
            ...gateway,
            queryGateway: error,
          })
        );
    },
    [searchResult, setGateway, getChain]
  );

  const handleLegacyTransactionURL = useCallback(
    (encodedTransactionInput) => {
      const transactionInput = decodeURIComponent(encodedTransactionInput);

      let transaction: LegacyRenVMTransaction =
        LegacyRenVMTransaction(transactionInput);
      if (
        searchResult &&
        !Array.isArray(searchResult) &&
        searchResult.resultPath === transaction.resultPath
      ) {
        transaction = searchResult as LegacyRenVMTransaction;
      }

      setTransaction(transaction);

      searchLegacyTransaction(transaction, getChain)
        .then((transaction) => {
          setTransaction(transaction);
          setUpdatedCount((count) => count + 1);
        })
        .catch((error) =>
          setTransaction({
            ...transaction,
            queryTx: error,
          })
        );
    },
    [searchResult, setTransaction, getChain]
  );

  return {
    searchResult,
    transaction,
    gateway,
    updatedCount,
    setSearchResult,
    handleSearchURL,
    handleSearchForm,
    handleTransactionURL,
    handleLegacyTransactionURL,
    handleGatewayURL,
    getChainDetails,
    getChain,
    handleSelectResult,
  };
}

export const UIContainer = createContainer(useUIContainer);
