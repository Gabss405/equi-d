import { useState } from "react";

import "./App.css";
import MapForm from "./MapForm/MapForm.js";
import Map from "./Map/Map";
// import ApiServices from "./services/ApiServices";

function App() {
  const [routeData, setRouteData] = useState({});

  return (
    <div className="app-container">
      <MapForm setRouteData={setRouteData} className="map-form-container" />
      {Object.keys(routeData).length !== 0 ? (
        <Map routeData={routeData} classname="map-container" />
      ) : (
        <div>Enter info to show map </div>
      )}
    </div>
  );
}

export default App;
