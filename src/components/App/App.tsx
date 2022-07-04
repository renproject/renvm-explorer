import { RenNetwork } from "@renproject/utils";
import { headerCase } from "change-case";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

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
                : `RenVM ${headerCase(NETWORK)} Explorer`;
    }, []);

    return (
        // The outer div has `h-screen` so that the footer is always at the bottom.
        <div className="h-screen flex flex-col">
            <NewHeader />
            <ErrorBoundary>
                <div className="mt-4 flex-grow mb-10">
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
            <Footer />
        </div>
    );
};
