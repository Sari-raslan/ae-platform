import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import "./style.css";

function App() {
  return (
    <div className="app">
      <div className="hero">
        <h1>AE Platform</h1>

        <p>
          Premium AI Workspace Platform
        </p>

        <div className="pricing">

          <div className="card">
            <h2>Starter</h2>
            <h3>8.99€</h3>
          </div>

          <div className="card premium">
            <h2>Premium</h2>
            <h3>17.99€</h3>
          </div>

          <div className="card">
            <h2>Pro</h2>
            <h3>39.99€</h3>
          </div>

        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);
