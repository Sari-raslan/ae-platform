import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <main className="app">
      <h1>Universal Arranger OS</h1>
      <p>Runtime OK</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
