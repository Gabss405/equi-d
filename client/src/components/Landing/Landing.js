import { GoogleMap, LoadScript, useGoogleMap } from "@react-google-maps/api";

import { useEffect, useState } from "react";
import "./Landing.css";

import Utilities from "../../utilities/Utilities";

//import from "../utilities/Utilities";

import { silver, retro } from "./map.styles/map.style";

const ApiKey = process.env.REACT_APP_API_KEY;

function Landing() {
  const mapStyles = {
    height: "70vw",
    width: "100vw",
  };
  // const map = useGoogleMap();

  // useEffect(() => {
  //   if (map) {
  //     map.panTo({ lat: 41.38879, lng: 2.15899 });
  //   }
  // });

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

  const london = { lat: 51.50853, lng: -0.076132 };
  const zoomRndm = Math.floor(Math.random() * 8) + 5;
  const random = randomCoord();

  return (
    <LoadScript googleMapsApiKey={ApiKey}>
      <div className="background">
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
          center={london}
        ></GoogleMap>
      </div>
    </LoadScript>
  );
}

export default Landing;
