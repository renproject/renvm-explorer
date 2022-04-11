import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";

import { MultiwalletProvider } from "@renproject/multiwallet-ui";

import { App } from "./components/App/App";
import { LatestTransactionsContainer } from "./containers/LatestTransactionsContainer";
import { UIContainer } from "./containers/UIContainer";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <MultiwalletProvider>
        <UIContainer.Provider>
          <LatestTransactionsContainer.Provider>
            <App />
          </LatestTransactionsContainer.Provider>
        </UIContainer.Provider>
      </MultiwalletProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
