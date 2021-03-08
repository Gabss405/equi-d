import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

import { useState, useEffect } from 'react';

import './Map.css';

import Utilities from '../../utilities/Utilities';

import { retro, retroLabels } from './map.styles/map.style';

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData, randomCity, landingZoom }) {
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

  console.log(routeData.nearbyPlaces);

  let zoomLevel = 5;

  // route: routes.route,
  //     etuor: routes.etuor,
  //     routePolyTimeUnit,
  //     etuorPolyTimeUnit,
  //     trueHalfway,
  //     a2TrueHalfwayDirections,
  //     b2TrueHalfwayDirections,
  //     a2TrueHalfwayDecodedPolyline,
  //     b2TrueHalfwayDecodedPolyline,
  //     a2TrueHalfwayDecodedPolylineMidPoint,
  //     b2TrueHalfwayDecodedPolylineMidPoint,

  let routePolylineOptions = {
    strokeColor: 'orange',
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: 'orange',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: routeData.a2TrueHalfwayDecodedPolyline,
    zIndex: 2,
  };

  let etuorPolylineOptions = {
    strokeColor: 'purple',
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: 'purple',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: routeData.b2TrueHalfwayDecodedPolyline,
    zIndex: 2,
  };

  let nearbyPlaces;

  if (routeData) {
    routePolylineOptions.paths = routeData.a2TrueHalfwayDecodedPolyline;
    etuorPolylineOptions.paths = routeData.b2TrueHalfwayDecodedPolyline;

    console.log('Optimal Halfway Duration(OHD) from A->A/B: ', Utilities.secondsToTime(routeData.route.routes[0].legs[0].duration.value / 2));
    console.log('Optimal Halfway Duration(OHD)  from B->B/A: ', Utilities.secondsToTime(routeData.etuor.routes[0].legs[0].duration.value / 2));
    console.log(`Margin of error (deviance allowed to OHD) (A->B): ${Utilities.secondsToTime(routeData.routePolyTimeUnit * 2)}`);
    console.log(`Margin of error (deviance allowed to OHD)(B->A): ${Utilities.secondsToTime(routeData.etuorPolyTimeUnit * 2)}`);

    console.log('It takes ', routeData.a2TrueHalfwayDirections.routes[0].legs[0].duration.text, ' to get from Origin A to true halfway');

    console.log('It takes ', routeData.b2TrueHalfwayDirections.routes[0].legs[0].duration.text, ' to get from Origin B to true halfway ');

    //TODO : optimize zoom

    // zoomLevel = Utilities.optimiseZoom(routeData.route);

    nearbyPlaces = routeData.nearbyPlaces.results.map((item) => {
      return (
        <Marker
          key={item.place_id}
          position={item.geometry.location}
          title={item.name}
          rating={item.rating}
          // icon={marker}
          icon={Utilities.pinSymbol('blue')}
          // onClick={() => onSelect(route.routes[0].legs[0])}
        >
          {item.rating > 4.3 && (
            <InfoWindow onLoad={() => {}} position={item.geometry.location}>
              <div className="places-infowindow">
                <p>{item.name}</p>
                {item.rating > 4.3 && <p>{item.rating}⭐</p>}
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    });
  }

  const mapStyles = {
    height: '52vw',
    width: '100vw',
  };

  console.log(routeData);

  const london = { lat: 51.50853, lng: -0.076132 };
  const zoomRndm = Math.floor(Math.random() * 11) + 7;

  return (
    <LoadScript googleMapsApiKey={ApiKey} libraries={['places']}>
      <>
        {routeData?.trueHalfway?.location && routeData.nearbyPlaces ? (
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
            zoom={16}
            center={routeData.trueHalfway.location}>
            {routeData.a2TrueHalfwayDecodedPolyline && (
              <div>
                <Polyline onLoad={(polyline) => {}} path={routePolylineOptions.paths} options={routePolylineOptions} />

                {routeData?.a2TrueHalfwayDecodedPolylineMidPoint && (
                  <InfoWindow onLoad={() => {}} position={routeData.a2TrueHalfwayDecodedPolylineMidPoint}>
                    <div className="infowindow">
                      <p>
                        {`${routeData.a2TrueHalfwayDirections.routes[0].legs[0].duration.text}
                     to to halfway point`}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            )}
            {routeData.b2TrueHalfwayDecodedPolyline && (
              <div>
                <Polyline onLoad={(polyline) => {}} path={etuorPolylineOptions.paths} options={etuorPolylineOptions} />
                {routeData?.b2TrueHalfwayDecodedPolylineMidPoint && (
                  <InfoWindow onLoad={() => {}} position={routeData.b2TrueHalfwayDecodedPolylineMidPoint}>
                    <div className="infowindow">
                      <p>
                        {`${routeData.b2TrueHalfwayDirections.routes[0].legs[0].duration.text}
                    to halfway point`}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            )}

            <Marker
              position={routeData.trueHalfway.location}
              title="Precise MidPoint"
              icon={Utilities.pinSymbol('red')}
              // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
            ></Marker>

            <Marker
              position={routeData.route.routes[0].legs[0].start_location}
              title="Origin A"
              // icon={marker}
              icon={Utilities.pinSymbol('yellow')}
              // onClick={() => onSelect(route.routes[0].legs[0])}
            ></Marker>
            <Marker
              position={routeData.etuor.routes[0].legs[0].start_location}
              title="Origin B"
              // icon={marker}
              icon={Utilities.pinSymbol('blue')}
              // onClick={() => onSelect(route.routes[0].legs[0])}
            ></Marker>

            {routeData?.nearbyPlaces?.results && <>{nearbyPlaces}</>}
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
            zoom={landingZoom ? landingZoom : zoomRndm}
            center={randomCity.location}
            // center={currentPosition}
          ></GoogleMap>
        )}
      </>
    </LoadScript>
  );
}

export default Map;
