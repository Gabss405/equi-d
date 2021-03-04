import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <div className="map-legend">
      <p style={{ color: "green" }}>Green: OriginA</p>
      <p style={{ color: "blue" }}> Blue: Origin B</p>
      <p style={{ color: "black" }}>
        Black: Mid Point based on polyline prediction
      </p>
      <p style={{ color: "lightgreen" }}>
        Lightgreen: Mid Point based on polyprecision
      </p>
      <p style={{ color: "lightblue" }}>
        Light Blue: Mid Point based on polyprecision Reverse Route
      </p>

      <p></p>
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
