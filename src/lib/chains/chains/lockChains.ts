import {
    Bitcoin,
    BitcoinCash,
    DigiByte,
    Dogecoin,
    Filecoin,
    Terra,
    Zcash,
} from "@renproject/chains";
import { Chain, RenNetwork } from "@renproject/utils";

import { ChainDetails, ChainType } from "./types";

export const BitcoinDetails: ChainDetails<Bitcoin> = {
    chain: Bitcoin.chain,
    assets: Bitcoin.assets,
    chainPattern: /^(bitcoin|btc)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new Bitcoin({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const ZcashDetails: ChainDetails<Zcash> = {
    chain: Zcash.chain,
    assets: Zcash.assets,
    chainPattern: /^(zcash|zec)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new Zcash({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const BitcoinCashDetails: ChainDetails<BitcoinCash> = {
    chain: BitcoinCash.chain,
    assets: BitcoinCash.assets,
    chainPattern: /^(bitcoincash|bch)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new BitcoinCash({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const DibiByteDetails: ChainDetails<DigiByte> = {
    chain: DigiByte.chain,
    assets: DigiByte.assets,
    chainPattern: /^(dibibyte|dgb)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new DigiByte({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const FilecoinDetails: ChainDetails<Filecoin> = {
    chain: Filecoin.chain,
    assets: Filecoin.assets,
    chainPattern: /^(filecoin|fil)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new Filecoin({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const LunaDetails: ChainDetails<Terra> = {
    chain: Terra.chain,
    assets: Terra.assets,
    chainPattern: /^(luna|terra)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new Terra({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};

export const DogecoinDetails: ChainDetails<Dogecoin> = {
    chain: Dogecoin.chain,
    assets: Dogecoin.assets,
    chainPattern: /^(dogecoin|doge)$/i,
    type: ChainType.LockChain,
    usePublicProvider: (network: RenNetwork) => new Dogecoin({ network }),
    getOutputParams: async (
        mintChain: Chain,
        to: string,
        payload: string,
        asset: string,
    ): Promise<any> => {
        return (mintChain as Bitcoin).Address(to);
    },
};
