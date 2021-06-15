import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { createContainer } from "unstated-next";
import { search } from "../lib/search";
import {
  RenVMGateway,
  RenVMTransaction,
  LegacyRenVMTransaction,
  SearchResult,
} from "../lib/searchResult";
import { searchTransaction } from "../lib/searchTransaction";
import { OrderedMap } from "immutable";
import { ChainCommon } from "@renproject/interfaces";
import { ChainMapper } from "../lib/chains";
import { NETWORK } from "../environmentVariables";
import { searchLegacyTransaction } from "../lib/searchLegacyTransaction";

function useUIContainer() {
  const history = useHistory();

  const [searchString, setSearchString] = useState<string | null>(null);
  const [searchResult, setSearchResult] =
    useState<SearchResult | SearchResult[] | null>(null);

  const [transaction, setTransaction] =
    useState<RenVMTransaction | LegacyRenVMTransaction | null | Error>(null);
  const [gateway, setGateway] = useState<RenVMGateway | null | Error>(null);
  const [updatedCount, setUpdatedCount] = useState(0);

  const [chains, setChains] = useState<OrderedMap<string, ChainCommon | null>>(
    OrderedMap()
  );
  const getChain = useCallback(
    (chainName: string) => {
      let chain = chains.get(chainName, null);
      if (chain) {
        return chain;
      }

      chain = ChainMapper(chainName, NETWORK);

      setChains((chains) => chains.set(chainName, chain));
      return chain;
    },
    [chains, setChains]
  );

  // handleSearchURL is called when the search parameter in the URL changes.
  const handleSearchURL = useCallback(
    (encodedSearchInput) => {
      setSearchResult(null);
      const searchInput = decodeURIComponent(encodedSearchInput);

      setSearchString(searchInput);

      search(searchInput, () => {}, getChain).then((result) => {
        if (result && Array.isArray(result) && result.length === 1) {
          result = result[0];
        }

        setSearchResult(result);

        if (result && !Array.isArray(result)) {
          history.replace(result.resultPath);
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
    searchString,
    searchResult,
    transaction,
    gateway,
    updatedCount,
    handleSearchURL,
    handleSearchForm,
    handleTransactionURL,
    handleLegacyTransactionURL,
    getChain,
    handleSelectResult,
  };
}

export const UIContainer = createContainer(useUIContainer);
