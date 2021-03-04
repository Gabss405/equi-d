import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { useEffect, useState } from "react";
import "./Map.css";

import Utilities from "../utilities/Utilities";

//import from "../utilities/Utilities";

import { silver } from "./map.styles/map.style";

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData }) {
  const [selected, setSelected] = useState("");

  // route: routes.route,
  //     etour: routes.etour,
  //     routePolyTimeUnit,
  //     etuorPolyTimeUnit,
  //     precPolyMidPointRoute,
  //     precPolyMidPointEtuor,
  //     routePrecMidDM,
  //     etuorPrecMidDM,

  console.log(routeData);

  console.log(
    "Half the total duration from A->A/B: ",
    Utilities.secondsToTime(
      routeData.route.routes[0].legs[0].duration.value / 2
    )
  );
  console.log(
    "Half the total duration from B->B/A: ",
    Utilities.secondsToTime(
      routeData.etour.routes[0].legs[0].duration.value / 2
    )
  );
  console.log(
    `Margin of error (A->B): ${Utilities.secondsToTime(
      routeData.routePolyTimeUnit * 2
    )}`
  );
  console.log(
    `Margin of error (B->A): ${Utilities.secondsToTime(
      routeData.etuorPolyTimeUnit * 2
    )}`
  );

  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.routePrecMidDM.rows[0].elements[0].duration.value
    ),
    " to get from Origin A to midpoint (A poly)"
  );

  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.etuorPrecMidDM.rows[0].elements[0].duration.value
    ),
    " to get from Origin B to midpoint (B poly)"
  );

  const onSelect = (item) => {
    setSelected(item);
  };

  function secondsToTime(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }
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

  console.log(routeData.route.routes[0].legs[0]);

  // function optimiseZoom() {
  //   if (routeData.route.routes[0].legs[0].duration.value) {
  //   }
  // }

  return (
    <LoadScript googleMapsApiKey={ApiKey}>
      {routeData?.precPolyMidPointRoute.location ? (
        <GoogleMap
          options={{ styles: silver }}
          mapContainerStyle={mapStyles}
          zoom={5}
          center={routeData.precPolyMidPointRoute.location}
        >
          <Marker
            position={routeData.precPolyMidPointRoute.location}
            title="Precise MidPoint"
            icon={pinSymbol("lightgreen")}
            // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>
          <Marker
            position={routeData.precPolyMidPointEtuor.location}
            title="Precise MidPoint"
            icon={pinSymbol("lightblue")}
            // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>

          <Marker
            position={routeData.route.routes[0].legs[0].start_location}
            title="Origin A"
            // icon={marker}
            icon={pinSymbol("green")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>

          <Marker
            position={routeData.etour.routes[0].legs[0].start_location}
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
