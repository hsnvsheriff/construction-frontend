import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./../localization"; // 🌐 i18n support
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"       // Adds class="light" or class="dark" to <html>
      defaultTheme="dark"     // Default to dark theme
      enableSystem={true}     // Match OS theme preference
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
