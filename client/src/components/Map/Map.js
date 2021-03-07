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

  console.log(currentPosition);

  let zoomLevel = 5;
  // routeData obj = {
  //     route: routes.route,
  //     etuor: routes.etuor,
  //     routePolyTimeUnit,
  //     etuorPolyTimeUnit,
  //     trueHalfway,
  //     a2TrueHalfway,
  //     b2TrueHalfway,
  //     trueHalfway,
  //   }

  let routePolyPath = [];
  let etuorPolyPath = [];

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
    console.log(routeData.decodedPolylines.route);

    routeData.decodedPolylines.route.map((item) => {
      if (item.id <= routeData.trueHalfway.id)
        routePolyPath.push(item.location);
    });

    console.log(routePolyPath);
    routeData.decodedPolylines.etuor.map((item) => {
      if (item.id <= routeData.trueHalfway.id)
        etuorPolyPath.push(item.location);
    });

    console.log(etuorPolyPath);

    routePolylineOptions.paths = routePolyPath;
    etuorPolylineOptions.paths = etuorPolyPath;

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

    console.log(routeData.b2TrueHalfway.rows[0].elements[0]);
    //TODO : route display polyline

    //TODO : optimize zoom

    //console.log(routeData.route.routes[0].legs[0]);

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
      {routeData?.trueHalfway?.location && routePolyPath ? (
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
          {routePolyPath ? (
            <div>
              <Polyline
                onLoad={(polyline) => {}}
                path={routePolyPath}
                options={routePolylineOptions}
              />
              <div>
                {routePolyPath && (
                  <Marker>
                    <InfoWindow
                      onLoad={() => {}}
                      position={routePolyPath[routePolyPath.length / 2]}
                    >
                      <div style={divStyle}>
                        <p>
                          {`It takes
                    ${Utilities.secondsToTime(
                      routeData.a2TrueHalfway.rows[0].elements[0].duration.value
                    )}
                    to get from
                    ${routeData.route.routes[0].legs[0].start_address} to true
                    halfway`}
                        </p>
                      </div>
                    </InfoWindow>
                  </Marker>
                )}
              </div>
            </div>
          ) : (
            <> Loading </>
          )}

          {etuorPolyPath ? (
            <div>
              <Polyline
                onLoad={(polyline) => {}}
                path={etuorPolyPath}
                options={etuorPolylineOptions}
              />
              {etuorPolyPath && (
                <Marker>
                  <InfoWindow
                    onLoad={() => {}}
                    position={etuorPolyPath[etuorPolyPath.length / 2]}
                  >
                    <div style={divStyle}>
                      <p>
                        {`It takes
                    ${Utilities.secondsToTime(
                      routeData.b2TrueHalfway.rows[0].elements[0].duration.value
                    )}
                    to get from
                    ${routeData.etuor.routes[0].legs[0].start_address} to true
                    halfway`}
                      </p>
                    </div>
                  </InfoWindow>
                </Marker>
              )}
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
