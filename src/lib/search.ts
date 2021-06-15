import { ChainCommon } from "@renproject/interfaces";
import { DEBUG } from "../environmentVariables";
import { NoResult, SearchResult } from "./searchResult";
import { searchTactics } from "./searchTactics";

/**
 * `search` accepts a transaction, address or RenVM hash and returns one of
 * 1) A RenVM Gateway
 * 2) A RenVM Transaction
 *
 * @param searchString
 */
export const search = async (
  searchString: string,
  updateStatus: (status: string) => void,
  getChain: (chainName: string) => ChainCommon | null
): Promise<SearchResult | SearchResult[]> => {
  for (const tactic of searchTactics) {
    try {
      if (tactic.match(searchString)) {
        const result = await tactic.search(
          searchString,
          updateStatus,
          getChain
        );
        if (result) {
          return result;
        }
      }
    } catch (error) {
      if (DEBUG) {
        console.error("DEBUG", error);
      }
    }
  }

  return NoResult;
};
