import { RenNetwork } from "@renproject/interfaces";
import { useEffect } from "react";
import { Route, Switch } from "react-router";
import { titleCase } from "title-case";
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
          <Switch>
            <Route path="/search/:search" component={SearchingPage} />

            <Route path="/tx/:hash" component={TransactionPage} />
            <Route path="/legacy-tx/:legacyHash" component={TransactionPage} />
            <Route path="/gateway/:address" component={GatewayPage} />

            <Route path="/tools" component={ToolsPage} />
            <Route path="/" exact component={Homepage} />
            <Route path="/" component={NotFound} />
          </Switch>
        </div>
      </ErrorBoundary>
    </AppOuter>
  );
};
