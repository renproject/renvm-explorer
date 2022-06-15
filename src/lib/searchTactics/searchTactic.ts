import RenJS from "@renproject/ren";
import { Chain } from "@renproject/utils";

import { SearchResult } from "../searchResult";

export interface SearchTactic<
    GenericResult extends SearchResult = SearchResult,
> {
    match: (
        searchString: string,
        getChain: (chainName: string) => Chain | null,
    ) => boolean;
    search: (
        searchString: string,
        updateStatus: (status: string) => void,
        getChain: (chainName: string) => Chain | null,
        renJS: RenJS,
    ) => Promise<GenericResult | GenericResult[] | null>;
}
