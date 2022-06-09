import { searchChainTransaction } from "./searchChainTransaction";
import { searchGateway } from "./searchGateway";
import { searchLegacyRenVMTransaction } from "./searchLegacyRenVMTransaction";
import { searchRenVMHash } from "./searchRenVMHash";
import { SearchTactic } from "./searchTactic";

export const searchTactics: SearchTactic[] = [
    // Search for v0.4 RenVM transactions.
    searchRenVMHash,

    // Search for v0.2 RenVM transactions.
    searchLegacyRenVMTransaction,

    // Search for a lock-chain transaction for mints, or for a burn-chain
    // transaction for burns.
    searchChainTransaction,

    // See if the details used to generate the gateway address have been stored
    // in the lightnode (from a `ren_submitGateway`).
    searchGateway,
];
