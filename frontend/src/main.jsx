import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import ProductionArrangerWorkspace
from "./components/ProductionArrangerWorkspace.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ProductionArrangerWorkspace />
  </React.StrictMode>
);
