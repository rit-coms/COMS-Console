
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { appWindow } from "@tauri-apps/api/window";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

appWindow.setFullscreen(true);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
