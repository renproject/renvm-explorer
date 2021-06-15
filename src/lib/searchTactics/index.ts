import { searchLegacyRenVMTransaction } from "./searchLegacyRenVMTransaction";
import { searchLockTransaction } from "./searchLockTransaction";
import { searchRenVMHash } from "./searchRenVMHash";
import { SearchTactic } from "./searchTactic";

export const searchTactics: SearchTactic[] = [
  // Search for v0.4 RenVM transactions.
  searchRenVMHash,

  // Search for v0.2 RenVM transactions.
  searchLegacyRenVMTransaction,

  // Search for hex-formatted lock transactions (e.g. BTC transactions)
  // (no 0x prefix)
  searchLockTransaction,
];
