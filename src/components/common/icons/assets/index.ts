import { ReactComponent as RenArbETHIcon } from "./renArbETH.svg";
import { ReactComponent as RenAVAXIcon } from "./renAVAX.svg";
import { ReactComponent as RenBADGERIcon } from "./renBADGER.svg";
import { ReactComponent as RenBCHIcon } from "./renBCH.svg";
import { ReactComponent as RenBNBIcon } from "./renBNB.svg";
import { ReactComponent as RenBTCIcon } from "./renBTC.svg";
import { ReactComponent as RenBUSDIcon } from "./renBUSD.svg";
import { ReactComponent as RenCOMPIcon } from "./renCOMP.svg";
import { ReactComponent as RenCRVIcon } from "./renCRV.svg";
import { ReactComponent as RenDAIIcon } from "./renDAI.svg";
import { ReactComponent as RenDGBIcon } from "./renDGB.svg";
import { ReactComponent as RenDOGEIcon } from "./renDOGE.svg";
import { ReactComponent as RenETHIcon } from "./renETH.svg";
import { ReactComponent as RenEURTIcon } from "./renEURT.svg";
import { ReactComponent as RenFILIcon } from "./renFIL.svg";
import { ReactComponent as RenFTMIcon } from "./renFTM.svg";
import { ReactComponent as RenFTTIcon } from "./renFTT.svg";
import { ReactComponent as RenKNCIcon } from "./renKNC.svg";
import { ReactComponent as RenLINKIcon } from "./renLINK.svg";
import { ReactComponent as RenLUNAIcon } from "./renLUNA.svg";
import { ReactComponent as RenMATICIcon } from "./renMATIC.svg";
import { ReactComponent as RenMIMIcon } from "./renMIM.svg";
import { ReactComponent as RenRENIcon } from "./renREN.svg";
import { ReactComponent as RenROOKIcon } from "./renROOK.svg";
import { ReactComponent as RenSOLIcon } from "./renSOL.svg";
import { ReactComponent as RenSUSHIIcon } from "./renSUSHI.svg";
import { ReactComponent as RenUNIIcon } from "./renUNI.svg";
import { ReactComponent as RenUSDCIcon } from "./renUSDC.svg";
import { ReactComponent as RenUSDTIcon } from "./renUSDT.svg";
import { ReactComponent as RenUSTIcon } from "./renUST.svg";
import { ReactComponent as RenWBTCIcon } from "./renwBTC.svg";
import { ReactComponent as RenZECIcon } from "./renZEC.svg";

export const Icons: {
    [key: string]: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
            title?: string | undefined;
        }
    >;
} = {
    AVAX: RenAVAXIcon,
    ArbETH: RenArbETHIcon,
    BADGER: RenBADGERIcon,
    BCH: RenBCHIcon,
    BNB: RenBNBIcon,
    BTC: RenBTCIcon,
    COMP: RenCOMPIcon,
    CRV: RenCRVIcon,
    DGB: RenDGBIcon,
    DOGE: RenDOGEIcon,
    ETH: RenETHIcon,
    FIL: RenFILIcon,
    FTM: RenFTMIcon,
    FTT: RenFTTIcon,
    KNC: RenKNCIcon,
    LINK: RenLINKIcon,
    LUNA: RenLUNAIcon,
    MATIC: RenMATICIcon,
    MIM: RenMIMIcon,
    REN: RenRENIcon,
    ROOK: RenROOKIcon,
    SOL: RenSOLIcon,
    SUSHI: RenSUSHIIcon,
    UNI: RenUNIIcon,
    wBTC: RenWBTCIcon,
    ZEC: RenZECIcon,
    BUSD: RenBUSDIcon,
    DAI: RenDAIIcon,
    EURT: RenEURTIcon,
    UST: RenUSTIcon,
    USDT: RenUSDTIcon,
    USDC: RenUSDCIcon,
};
