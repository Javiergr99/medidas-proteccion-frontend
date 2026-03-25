import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import AppProviders from "./app/providers";
import { setupInterceptors } from "./api/interceptors";

setupInterceptors();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);