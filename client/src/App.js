import { useState } from "react";

import "./App.css";
import MapForm from "./components/MapForm/MapForm";
import Map from "./components/Map/Map";
import Draggable from "react-draggable";

function App() {
  const [routeData, setRouteData] = useState({});

  // eventLogger = (e: MouseEvent, data: Object) => {
  //   console.log('Event: ', e);
  //   console.log('Data: ', data);
  // };

  return (
    <div className="app-container">
      <Draggable bounds="parent">
        <div
          className="map-form-container"
          style={{ position: "absolute", zIndex: "3" }}
        >
          <MapForm setRouteData={setRouteData} />
        </div>
      </Draggable>

      {Object.keys(routeData).length > 0 ? (
        <div className="all-maps-container">
          <div
            className="result-map"
            style={{ position: "relative", zIndex: "2" }}
          >
            <Map routeData={routeData} />
          </div>
        </div>
      ) : (
        <div className="all-maps-container">
          <div
            className="result-map"
            style={{ position: "relative", zIndex: "2" }}
          >
            <Map routeData={false} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
