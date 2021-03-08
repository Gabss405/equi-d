import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";

import { useState, useEffect } from "react";
import "./Map.css";

import Utilities from "../../utilities/Utilities";

//import from "../utilities/Utilities";

import { retro, retroLabels } from "./map.styles/map.style";
import cities from "../../assets/cities";

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData }) {
  //const [selected, setSelected] = useState("");
  const [currentPosition, setCurrentPosition] = useState({});

  const success = (position) => {
    navigator.geolocation.getCurrentPosition(success);
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  //

  let zoomLevel = 5;

  // route: routes.route,
  // etuor: routes.etuor,
  // routePolyTimeUnit,
  // etuorPolyTimeUnit,
  // trueHalfway,
  // a2TrueHalfwayDirections,
  // b2TrueHalfwayDirections,
  // a2TrueHalfwayDecodedPolyline,
  // b2TrueHalfwayDecodedPolyline,
  // let routePolyPath = [];
  // let routeData.b2TrueHalfwayDecodedPolyline  = [];

  let routePolylineOptions = {
    strokeColor: "orange",
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: "orange",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: [],
    zIndex: 2,
  };

  let etuorPolylineOptions = {
    strokeColor: "purple",
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: "purple",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: [],
    zIndex: 2,
  };

  if (routeData) {
    //console.log(routeData.decodedPolylines.route);

    // routeData.decodedPolylines.route.map((item) => {
    //   if (item.id <= routeData.trueHalfway.id)
    //     routePolyPath.push(item.location);
    // });

    // console.log(routePolyPath);
    // routeData.decodedPolylines.etuor.map((item) => {
    //   if (item.id <= routeData.trueHalfway.id)
    //     routeData.b2TrueHalfwayDecodedPolyline .push(item.location);
    // });

    // console.log(routeData.b2TrueHalfwayDecodedPolyline );

    routePolylineOptions.paths = routeData.a2TrueHalfwayDecodedPolyline;
    etuorPolylineOptions.paths = routeData.b2TrueHalfwayDecodedPolyline;

    console.log(
      "Optimal Halfway Duration(OHD) from A->A/B: ",
      Utilities.secondsToTime(
        routeData.route.routes[0].legs[0].duration.value / 2
      )
    );
    console.log(
      "Optimal Halfway Duration(OHD)  from B->B/A: ",
      Utilities.secondsToTime(
        routeData.etuor.routes[0].legs[0].duration.value / 2
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
      routeData.a2TrueHalfwayDirections.routes[0].legs[0].duration.text,
      " to get from Origin A to true halfway"
    );

    console.log(
      "It takes ",
      routeData.b2TrueHalfwayDirections.routes[0].legs[0].duration.text,
      " to get from Origin B to true halfway "
    );

    //TODO : optimize zoom

    zoomLevel = Utilities.optimiseZoom(routeData.route);
    // console.log(polylineOptions.paths);
    // console.log(routePolyPath);
  }

  const mapStyles = {
    height: "70vw",
    width: "100vw",
  };
  const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    padding: 15,
  };

  console.log(routeData);

  //const london = { lat: 51.50853, lng: -0.076132 };
  const zoomRndm = Math.floor(Math.random() * 11) + 7;

  // console.log(cities[Math.floor(Math.random() * cities.length)]);

  const randomCity = cities[Math.floor(Math.random() * cities.length)];

  // const random = {
  //   lat: cities[Math.floor(Math.random() * cities.length)].lat,
  //   lng: cities[Math.floor(Math.random() * cities.length)].lng,
  // };

  // console.log(cities.indexOf(randomCity));

  return (
    <LoadScript googleMapsApiKey={ApiKey} libraries={["places"]}>
      {routeData?.trueHalfway?.location ? (
        <GoogleMap
          options={{
            styles: retroLabels,
            mapTypeControl: false,
            zoomControl: true,
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
          {routeData?.a2TrueHalfwayDecodedPolyline ? (
            <div>
              <Polyline
                onLoad={(polyline) => {}}
                path={routeData.a2TrueHalfwayDecodedPolyline}
                options={routePolylineOptions}
              />
              <div>
                {/* {routeData.a2TrueHalfwayDecodedPolyline && (
                  <InfoWindow onLoad={() => {}}>
                    <div style={divStyle}>
                      <p>
                        {`It takes
                    ${routeData.a2TrueHalfwayDirections.routes[0].legs[0].duration.text}
                    to get from
                    ${routeData.route.routes[0].legs[0].start_address} to true
                    halfway`}
                      </p>
                    </div>
                  </InfoWindow>
                )} */}
              </div>
            </div>
          ) : (
            <> Loading </>
          )}

          {routeData?.b2TrueHalfwayDecodedPolyline ? (
            <div>
              <Polyline
                onLoad={(polyline) => {}}
                path={routeData.b2TrueHalfwayDecodedPolyline}
                options={etuorPolylineOptions}
              />
              {/* {routeData.b2TrueHalfwayDecodedPolyline && (
                <Marker
                  position={
                    routeData.b2TrueHalfwayDecodedPolyline[
                      routeData.b2TrueHalfwayDecodedPolyline.length / 2
                    ]
                  }
                >
                  <InfoWindow
                    onLoad={() => {}}
                    position={
                      routeData.b2TrueHalfwayDecodedPolyline[
                        routeData.b2TrueHalfwayDecodedPolyline.length / 2
                      ]
                    }
                  >
                    <div style={divStyle}>
                      <p>
                        {`It takes
                    ${routeData.b2TrueHalfwayDirections.routes[0].legs[0].duration.text}
                    to get from
                    ${routeData.etuor.routes[0].legs[0].start_address} to true
                    halfway`}
                      </p>
                    </div>
                  </InfoWindow>
                </Marker>
              )} */}
            </div>
          ) : (
            <> </>
          )}

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
            icon={Utilities.pinSymbol("yellow")}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>
          <Marker
            position={routeData.etuor.routes[0].legs[0].start_location}
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
          center={{ lat: +randomCity.lat, lng: +randomCity.lng }}
          // center={currentPosition}
        ></GoogleMap>
      )}
    </LoadScript>
  );
}

export default Map;
