import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import "./index.scss";
import { App } from "./components/App/App";
import reportWebVitals from "./reportWebVitals";
import { UIContainer } from "./containers/UIContainer";
import { MultiwalletProvider } from "@renproject/multiwallet-ui";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <MultiwalletProvider>
        <UIContainer.Provider>
          <App />
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
