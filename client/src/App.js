import { useState } from "react";

import "./App.css";
import MapForm from "./components/MapForm/MapForm";
import Map from "./components/Map/Map";
import Landing from "./components/Landing/Landing";
// import ApiServices from "./services/ApiServices";

function App() {
  const [routeData, setRouteData] = useState({});

  return (
    <div className="app-container">
      <div
        className="map-form-container"
        style={{ position: "absolute", zIndex: "3" }}
      >
        <MapForm setRouteData={setRouteData} />
      </div>

      <div className="all-maps-container">
        {Object.keys(routeData).length !== 0 ? (
          <div
            className="result-map"
            style={{ position: "relative", zIndex: "2" }}
          >
            <Map routeData={routeData} />
          </div>
        ) : (
          <div
            className="landing"
            style={{ position: "relative", zIndex: "2" }}
          >
            <Landing />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
