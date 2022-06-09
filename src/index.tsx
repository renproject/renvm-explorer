import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "./components/App/App";
import { LatestTransactionsContainer } from "./containers/LatestTransactionsContainer";
import { UIContainer } from "./containers/UIContainer";
import { WalletContainer } from "./containers/WalletContainer";
import { ChainTxSubmitter } from "./packages/ChainTxSubmitter";
import reportWebVitals from "./reportWebVitals";

const render = () => {
    ReactDOM.render(
        <React.StrictMode>
            <Router>
                <WalletContainer.Provider>
                    <UIContainer.Provider>
                        <ChainTxSubmitter.Provider>
                            <LatestTransactionsContainer.Provider>
                                <App />
                            </LatestTransactionsContainer.Provider>
                        </ChainTxSubmitter.Provider>
                    </UIContainer.Provider>
                </WalletContainer.Provider>
            </Router>
        </React.StrictMode>,
        document.getElementById("root"),
    );
};

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
