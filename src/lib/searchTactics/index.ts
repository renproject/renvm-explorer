import { searchLegacyRenVMTransaction } from "./searchLegacyRenVMTransaction";
import { searchChainTransaction } from "./searchChainTransaction";
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
];
