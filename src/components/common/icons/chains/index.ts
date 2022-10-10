import {
    Arbitrum,
    Avalanche,
    BinanceSmartChain,
    Bitcoin,
    BitcoinCash,
    Catalog,
    DigiByte,
    Dogecoin,
    Ethereum,
    Fantom,
    Filecoin,
    Goerli,
    Kava,
    Moonbeam,
    Optimism,
    Polygon,
    Solana,
    Terra,
    Zcash,
} from "@renproject/chains";

import { ReactComponent as ArbitrumIcon } from "./arbitrum.svg";
import { ReactComponent as AvalancheIcon } from "./avalanche.svg";
import { ReactComponent as BinanceSmartChainIcon } from "./binancesmartchain.svg";
import { ReactComponent as BitcoinIcon } from "./bitcoin.svg";
import { ReactComponent as BitcoinCashIcon } from "./bitcoincash.svg";
import { ReactComponent as CatalogIcon } from "./catalog.svg";
import { ReactComponent as DigiByteIcon } from "./digibyte.svg";
import { ReactComponent as DogecoinIcon } from "./dogecoin.svg";
import { ReactComponent as EthereumIcon } from "./ethereum.svg";
import { ReactComponent as FantomIcon } from "./fantom.svg";
import { ReactComponent as FilecoinIcon } from "./filecoin.svg";
import { ReactComponent as KavaIcon } from "./kava.svg";
import { ReactComponent as MoonbeamIcon } from "./moonbeam.svg";
import { ReactComponent as OptimismIcon } from "./optimism.svg";
import { ReactComponent as PolygonIcon } from "./polygon.svg";
import { ReactComponent as RenVMIcon } from "./renvm.svg";
import { ReactComponent as SolanaIcon } from "./solana.svg";
import { ReactComponent as TerraIcon } from "./terra.svg";
import { ReactComponent as ZcashIcon } from "./zcash.svg";

export const Icons: {
    [key: string]: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
            title?: string | undefined;
        }
    >;
} = {
    [Arbitrum.chain]: ArbitrumIcon,
    [Avalanche.chain]: AvalancheIcon,
    [BinanceSmartChain.chain]: BinanceSmartChainIcon,
    [Bitcoin.chain]: BitcoinIcon,
    [BitcoinCash.chain]: BitcoinCashIcon,
    [Catalog.chain]: CatalogIcon,
    [DigiByte.chain]: DigiByteIcon,
    [Dogecoin.chain]: DogecoinIcon,
    [Ethereum.chain]: EthereumIcon,
    [Fantom.chain]: FantomIcon,
    [Filecoin.chain]: FilecoinIcon,
    [Goerli.chain]: EthereumIcon,
    [Kava.chain]: KavaIcon,
    [Moonbeam.chain]: MoonbeamIcon,
    [Optimism.chain]: OptimismIcon,
    [Polygon.chain]: PolygonIcon,
    [Solana.chain]: SolanaIcon,
    [Terra.chain]: TerraIcon,
    [Zcash.chain]: ZcashIcon,
    RenVM: RenVMIcon,
};
