import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { titleCase } from "title-case";

import { RenNetwork } from "@renproject/utils";

import { NETWORK } from "../../environmentVariables";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { Header } from "../Header/Header";
import { GatewayPage } from "../pages/GatewayPage/GatewayPage";
import { Homepage } from "../pages/Homepage/Homepage";
import { SearchingPage } from "../pages/SearchingPage/SearchingPage";
import { ToolsPage } from "../pages/ToolsPage/Tools";
import { TransactionPage } from "../pages/TransactionPage/TransactionPage";
import { AppOuter } from "./AppStyles";

const NotFound = () => <p>Not found</p>;

export const App = () => {
  useEffect(() => {
    document.title =
      NETWORK === RenNetwork.Mainnet
        ? `RenVM Explorer`
        : `RenVM ${titleCase(NETWORK)} Explorer`;
  }, []);

  return (
    <AppOuter>
      <Header />
      <ErrorBoundary>
        <div style={{ marginTop: 20 }}>
          <Routes>
            <Route path="/search/:search" element={<SearchingPage />} />

            <Route path="/tx/:hash" element={<TransactionPage />} />
            <Route
              path="/legacy-tx/:legacyHash"
              element={<TransactionPage />}
            />
            <Route path="/gateway/:address" element={<GatewayPage />} />

            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/" element={<Homepage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </AppOuter>
  );
};
