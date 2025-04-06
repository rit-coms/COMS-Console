
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { appWindow } from "@tauri-apps/api/window";
import App from "./App";
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
