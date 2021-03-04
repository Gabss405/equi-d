import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { useEffect, useState } from "react";
import "./Map.css";

import Utilities from "../utilities/Utilities";

import { silver } from "./map.styles/map.style";

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData }) {
  const [selected, setSelected] = useState("");

  console.log(
    "Half the total duration from A->A/B: ",
    Utilities.secondsToTime(
      routeData.route.routes[0].legs[0].duration.value / 2
    )
  );
  console.log(
    `Margin of error: ${Utilities.secondsToTime(routeData.polyTimeUnit * 2)}`
  );
  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.a2MidpointDM.rows[0].elements[0].duration.value
    ),
    " to get from Origin B to midpoint"
  );
  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.b2MidpointDM.rows[0].elements[0].duration.value
    ),
    " to get from Origin A to midpoint"
  );

  console.log(routeData.precPolyMidPoint.location);

  const onSelect = (item) => {
    setSelected(item);
  };

  function pinSymbol(color) {
    return {
      path:
        "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#000",
      strokeWeight: 2,
      scale: 1,
    };
  }

  const mapStyles = {
    height: "60vh",
    width: "60vw",
  };

  //TODO : optimize zoom
  // function getZoom(route) {
  //   if (route.routes[0].legs[0].distance.value) {
  //   }
  // }

  return (
    <LoadScript googleMapsApiKey={ApiKey}>
      {routeData?.precPolyMidPoint.location ? (
        <GoogleMap
          options={{ styles: silver }}
          mapContainerStyle={mapStyles}
          zoom={5}
          center={routeData.precPolyMidPoint.location}
        >
          <Marker
            position={routeData.precPolyMidPoint.location}
            title="Precise MidPoint"
            icon={pinSymbol("lightgreen")}
            onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>

          <Marker
            position={routeData.route.routes[0].legs[0].start_location}
            title="Origin A"
            // icon={marker}
            icon={pinSymbol("green")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>

          <Marker
            position={routeData.route.routes[0].legs[0].end_location}
            title="Origin B"
            // icon={marker}
            icon={pinSymbol("blue")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>
        </GoogleMap>
      ) : (
        <p>Loading...</p>
      )}
    </LoadScript>
  );
}

export default Map;
