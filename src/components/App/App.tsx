import { RenNetwork } from "@renproject/utils";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { titleCase } from "title-case";

import { NETWORK } from "../../environmentVariables";
import { ErrorBoundary } from "../common/ErrorBoundary";
import Footer from "../Footer";
import { NewHeader } from "../Header/NewHeader";
import { GatewayPage } from "../pages/GatewayPage/GatewayPage";
import { Homepage } from "../pages/Homepage/Homepage";
import { SearchingPage } from "../pages/SearchingPage/SearchingPage";
import { TransactionPage } from "../pages/TransactionPage/TransactionPage";

const NotFound = () => <p>Not found</p>;

// const Redirect = ({ path, to }: { path: string; to: string }) => {
//     return <Route path={path} element={<Navigate to={to} replace={true} />} />;
// };

export const App = () => {
    useEffect(() => {
        document.title =
            NETWORK === RenNetwork.Mainnet
                ? `RenVM Explorer`
                : `RenVM ${titleCase(NETWORK)} Explorer`;
    }, []);

    return (
        <div className="h-screen flex flex-col">
            <ReactTooltip className="max-w-xs sm:max-w-sm" effect="solid" />
            <NewHeader />
            <ErrorBoundary className="bg-white shadow-lg sm:rounded-lg border border-gray-200 p-5 mt-5">
                <div className="mt-4 flex-grow">
                    <Routes>
                        <Route
                            path="/search/:search"
                            element={<SearchingPage />}
                        />
                        <Route
                            path="/gateway/:address"
                            element={<GatewayPage />}
                        />
                        <Route
                            path="/address/:address"
                            element={<GatewayPage />}
                        />
                        <Route path="/tx/:hash" element={<TransactionPage />} />

                        <Route path="/" element={<Homepage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </ErrorBoundary>
            <br />
            <br />
            <br />
            <Footer />
        </div>
    );
};
