import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

import './Map.css';
import { retro, retroLabels, mapStyles, marker } from './map.styles/map.style';

import Utilities from '../../utilities/Utilities';
const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData, randomCity, landingZoom }) {
  const [currentPosition, setCurrentPosition] = useState({});
  const [showPolylineA, setShowPolylineA] = useState(false);
  const [showPolylineB, setShowPolylineB] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showMidpointInfoWindow, setShowMidpointInfoWindow] = useState(false);

  const success = (position) => {
    navigator.geolocation.getCurrentPosition(success);
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  let routePolylineOptions = {
    strokeColor: '#64b6ac',
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: '#64b6ac',
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: routeData.a2TrueHalfwayDecodedPolyline,
    zIndex: 2,
  };

  let etuorPolylineOptions = {
    strokeColor: '#b09e99',
    strokeOpacity: 0.8,
    strokeWeight: 8,
    fillColor: '#64b6ac',
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: routeData.b2TrueHalfwayDecodedPolyline,
    zIndex: 2,
  };

  let nearbyPlaces = [];

  if (routeData.nearbyPlaces) {
    if (Object.keys(routeData.nearbyPlaces).length > 0) {
      nearbyPlaces = routeData.nearbyPlaces.results.map((item) => {
        return (
          <Marker
            key={item.place_id}
            position={item.geometry.location}
            title={item.name}
            rating={item.rating}
            icon={Utilities.pinSymbol('#fee9e1')}
            onClick={() => {
              setSelectedCenter(item);
            }}>
            <InfoWindow onLoad={() => {}} position={item.geometry.location} visible={false} onCloseClick={() => setSelectedCenter(null)}>
              <div className="places-infowindow">
                <p>{item.name}</p>
                {item.rating && <p>{item.rating}⭐</p>}
                {/* <img src={item.icon} /> */}
                <a href={`https://www.google.com/maps/search/?api=1&query=${item.geometry.location.lat},${item.geometry.location.lng}`} className="direct-link">
                  Take me there
                </a>
              </div>
            </InfoWindow>
          </Marker>
        );
      });
    }
  }

  const handlePolylineAClick = () => {
    setShowPolylineA(!showPolylineA);
  };

  const handlePolylineBClick = () => {
    setShowPolylineB(!showPolylineB);
  };

  const handleMidPointClick = () => {
    setShowMidpointInfoWindow(!showMidpointInfoWindow);
  };

  useEffect(() => {}, [showPolylineA, showPolylineB, showMidpointInfoWindow]);
  const zoomRndm = Math.floor(Math.random() * 11) + 7;

  const markerStyle = {
    width: '0.5vw',
    height: '0.5vw',
  };

  return (
    <LoadScript googleMapsApiKey={ApiKey} libraries={['places']}>
      <>
        {routeData?.trueHalfway?.location && routeData.nearbyPlaces ? (
          <GoogleMap
            options={{
              styles: retroLabels,
              mapTypeControl: false,
              zoomControl: false,
              scaleControl: false,
              streetViewControl: false,
              fullscreenControl: false,
            }}
            mapContainerStyle={mapStyles}
            zoom={7}
            center={routeData.trueHalfway.location}>
            {routeData.a2TrueHalfwayDecodedPolyline && (
              <div>
                <Polyline onLoad={(polyline) => {}} path={routePolylineOptions.paths} options={routePolylineOptions} name="polylineA" onClick={handlePolylineAClick} />

                {routeData?.a2TrueHalfwayDecodedPolylineMidPoint && showPolylineA && (
                  <InfoWindow onLoad={() => {}} position={routeData.a2TrueHalfwayDecodedPolylineMidPoint}>
                    <div className="infowindow">
                      <p>{`${routeData.a2TrueHalfwayDirections.routes[0].legs[0].duration.text}`}</p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            )}
            {routeData.b2TrueHalfwayDecodedPolyline && (
              <div>
                <Polyline onLoad={(polyline) => {}} path={etuorPolylineOptions.paths} options={etuorPolylineOptions} name="polylineB" onClick={handlePolylineBClick} />
                {routeData?.b2TrueHalfwayDecodedPolylineMidPoint && showPolylineB && (
                  <InfoWindow onLoad={() => {}} position={routeData.b2TrueHalfwayDecodedPolylineMidPoint}>
                    <div className="infowindow">
                      <p>{`${routeData.b2TrueHalfwayDirections.routes[0].legs[0].duration.text}`}</p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            )}

            <Marker position={routeData.trueHalfway.location} title="Precise MidPoint" icon={Utilities.pinSymbol('#c0fdfb')} onClick={handleMidPointClick}>
              {showMidpointInfoWindow && (
                <InfoWindow onLoad={() => {}} position={routeData.trueHalfway.location}>
                  <div className="infowindow-midpoint">
                    <p>
                      Halfway between <b>{routeData.route.routes[0].legs[0].start_address}</b> and <b>{routeData.etuor.routes[0].legs[0].start_address}</b>
                    </p>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${routeData.trueHalfway.location.lat},${routeData.trueHalfway.location.lng}`} className="direct-link">
                      Direct me here
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Marker>

            <Marker position={routeData.route.routes[0].legs[0].start_location} title="Origin A" icon={Utilities.pinSymbol('#b09e99')}></Marker>
            <Marker
              position={routeData.etuor.routes[0].legs[0].start_location}
              title="Origin B"
              icon={Utilities.pinSymbol('#64b6ac')}
              // icon={markerSymbol}
              className="origin-B"
              options={{ style: markerStyle }}></Marker>

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
            center={randomCity.location}></GoogleMap>
        )}
      </>
    </LoadScript>
  );
}

export default Map;
