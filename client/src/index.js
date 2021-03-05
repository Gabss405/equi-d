import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <div className="app-container">
      <App />
    </div>
    <div className="map-legend">
      <div>
        <p style={{ color: "red" }}> A-B midpoint</p>
        <p style={{ color: "green" }}>B-C midpoint</p>
        <p style={{ color: "blue" }}>C-A midpoint</p>

        <p style={{ color: "lightgreen" }}>
          Lightgreen: Mid Point based on polyprecision
        </p>
        <p style={{ color: "lightblue" }}>
          Light Blue: Mid Point based on polyprecision Reverse Route
        </p>

        <p></p>
      </div>
      <ul className="disclaimer">
        <li>
          more margin of error for long distances (Chicago - LA) over 4 hours
        </li>
        <li>still within margin for 8hrs+ drives (stop for petrol etc.)</li>
        <li>lake/bridge problem</li>
      </ul>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
