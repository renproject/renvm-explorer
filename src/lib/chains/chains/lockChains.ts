import {
    Bitcoin,
    BitcoinCash,
    DigiByte,
    Dogecoin,
    Filecoin,
    Terra,
    Zcash,
} from "@renproject/chains";
import { RenNetwork } from "@renproject/utils";

import { ChainDetails } from "./types";

export const BitcoinDetails: ChainDetails<Bitcoin> = {
  chain: "Bitcoin",
  nativeAssets: [{ symbol: "BTC", name: "Bitcoin" }],
  chainPattern: /^(bitcoin|btc)$/i,
  usePublicProvider: (network: RenNetwork) => new Bitcoin({ network }),
};

export const ZcashDetails: ChainDetails<Zcash> = {
  chain: "Zcash",
  nativeAssets: [{ symbol: "ZEC", name: "Zcash" }],
  chainPattern: /^(zcash|zec)$/i,
  usePublicProvider: (network: RenNetwork) => new Zcash({ network }),
};

export const BitcoinCashDetails: ChainDetails<BitcoinCash> = {
  chain: "BitcoinCash",
  nativeAssets: [{ symbol: "BCH", name: "BitcoinCash" }],
  chainPattern: /^(bitcoincash|bch)$/i,
  usePublicProvider: (network: RenNetwork) => new BitcoinCash({ network }),
};

export const DibiByteDetails: ChainDetails<DigiByte> = {
  chain: "DibiByte",
  nativeAssets: [{ symbol: "DGB", name: "DibiByte" }],
  chainPattern: /^(dibibyte|dgb)$/i,
  usePublicProvider: (network: RenNetwork) => new DigiByte({ network }),
};

export const FilecoinDetails: ChainDetails<Filecoin> = {
  chain: "Filecoin",
  nativeAssets: [{ symbol: "FIL", name: "Filecoin" }],
  chainPattern: /^(filecoin|fil)$/i,
  usePublicProvider: (network: RenNetwork) => new Filecoin({ network }),
};

export const LunaDetails: ChainDetails<Terra> = {
  chain: "Luna",
  nativeAssets: [{ symbol: "LUNA", name: "Luna" }],
  chainPattern: /^(luna|terra)$/i,
  usePublicProvider: (network: RenNetwork) => new Terra({ network }),
};

export const DogecoinDetails: ChainDetails<Dogecoin> = {
  chain: "Dogecoin",
  nativeAssets: [{ symbol: "DOGE", name: "Dogecoin" }],
  chainPattern: /^(dogecoin|doge)$/i,
  usePublicProvider: (network: RenNetwork) => new Dogecoin({ network }),
};
