import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import FinalProductionWorkspace
from "./components/FinalProductionWorkspace.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <FinalProductionWorkspace />
  </React.StrictMode>
);
