import { ChainCommon } from "@renproject/interfaces";
import { SearchResult } from "../searchResult";

export interface SearchTactic<
  GenericResult extends SearchResult = SearchResult
> {
  match: (searchString: string) => boolean;
  search: (
    searchString: string,
    updateStatus: (status: string) => void,
    getChain: (chainName: string) => ChainCommon | null
  ) => Promise<GenericResult | GenericResult[] | null>;
}