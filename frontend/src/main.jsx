import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import RealtimeProductionSuite
from "./components/RealtimeProductionSuite.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RealtimeProductionSuite />
  </React.StrictMode>
);
