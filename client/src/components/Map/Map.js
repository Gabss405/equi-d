import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

import { useEffect, useState } from "react";
import "./Map.css";

import Utilities from "../../utilities/Utilities";

//import from "../utilities/Utilities";

import { silver, retro } from "./map.styles/map.style";

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData }) {
  const [selected, setSelected] = useState("");

  // routeData obj = {
  //     route: routes.route,
  //     etour: routes.etour,
  //     routePolyTimeUnit,
  //     etuorPolyTimeUnit,
  //     trueHalfway,
  //     a2TrueHalfway,
  //     b2TrueHalfway,
  //     trueHalfway,
  //   }

  console.log(routeData);

  console.log(
    "Optimal Halfway Duration(OHD) from A->A/B: ",
    Utilities.secondsToTime(
      routeData.route.routes[0].legs[0].duration.value / 2
    )
  );
  console.log(
    "Optimal Halfway Duration(OHD)  from B->B/A: ",
    Utilities.secondsToTime(
      routeData.etour.routes[0].legs[0].duration.value / 2
    )
  );
  console.log(
    `Margin of error (deviance allowed to OHD) (A->B): ${Utilities.secondsToTime(
      routeData.routePolyTimeUnit * 2
    )}`
  );
  console.log(
    `Margin of error (deviance allowed to OHD)(B->A): ${Utilities.secondsToTime(
      routeData.etuorPolyTimeUnit * 2
    )}`
  );

  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.a2TrueHalfway.rows[0].elements[0].duration.value
    ),
    " to get from Origin A to true halfway"
  );

  console.log(
    "It takes ",
    Utilities.secondsToTime(
      routeData.b2TrueHalfway.rows[0].elements[0].duration.value
    ),
    " to get from Origin B to true halfway "
  );

  const onSelect = (item) => {
    setSelected(item);
  };

  const mapStyles = {
    height: "70vw",
    width: "100vw",
  };

  //TODO : route display polyline

  //TODO : optimize zoom

  //console.log(routeData.route.routes[0].legs[0]);

  const zoomLevel = Utilities.optimiseZoom(routeData.route);
  console.log(zoomLevel);

  function randomCoord() {
    let rndmLat =
      Math.ceil(Math.random() * 60) * (Math.round(Math.random()) ? 1 : -1);
    let rndmLng =
      Math.ceil(Math.random() * 150) * (Math.round(Math.random()) ? 1 : -1);

    if (rndmLng < -70) rndmLat += 30;
    if (-40 < rndmLng < -20) rndmLng += 10;
    if (40 < rndmLng < 150) rndmLat += 30;

    return { lat: rndmLat, lng: rndmLng };
  }

  //const london = { lat: 51.50853, lng: -0.076132 };
  const zoomRndm = Math.floor(Math.random() * 8) + 5;
  const random = randomCoord();

  return (
    <LoadScript googleMapsApiKey={ApiKey}>
      {routeData?.trueHalfway.location ? (
        <GoogleMap
          options={{
            styles: retro,
            mapTypeControl: false,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={mapStyles}
          zoom={zoomLevel}
          center={routeData.trueHalfway.location}
        >
          {/* <Marker
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
          ></Marker> */}

          <Marker
            position={routeData.trueHalfway.location}
            title="Precise MidPoint"
            icon={Utilities.pinSymbol("red")}
            // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>

          <Marker
            position={routeData.route.routes[0].legs[0].start_location}
            title="Origin A"
            // icon={marker}
            icon={Utilities.pinSymbol("green")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>
          <Marker
            position={routeData.etour.routes[0].legs[0].start_location}
            title="Origin B"
            // icon={marker}
            icon={Utilities.pinSymbol("blue")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>
        </GoogleMap>
      ) : (
        <GoogleMap
          options={{
            styles: retro,
            mapTypeControl: false,
            zoomControl: false,
            scaleControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
          mapContainerStyle={mapStyles}
          zoom={zoomRndm}
          center={random}
        ></GoogleMap>
      )}
    </LoadScript>
  );
}

export default Map;
