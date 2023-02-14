import React from "react";
import ReactDOM from "react-dom/client";
import AssertServerDevTools from "./AssertServerDevTools";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AssertServerDevTools />
  </React.StrictMode>
);
