import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

import { useEffect, useState } from 'react';
import './Map.css';

import Utilities from '../utilities/Utilities';

import { silver } from './map.styles/map.style';

const ApiKey = process.env.REACT_APP_API_KEY;

function Map({ routeData }) {
  const [selected, setSelected] = useState('');

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

  // console.log(routeData.abbccaDM);

  console.log('Client got routeData: ', routeData);
  // console.log(
  //   "Optimal Halfway Duration(OHD) from A->A/B: ",
  //   Utilities.secondsToTime(
  //     routeData.route.routes[0].legs[0].duration.value / 2
  //   )
  // );
  // console.log(
  //   "Optimal Halfway Duration(OHD)  from B->B/A: ",
  //   Utilities.secondsToTime(
  //     routeData.etour.routes[0].legs[0].duration.value / 2
  //   )
  // );
  // console.log(
  //   `Margin of error (deviance allowed to OHD) (A->B): ${Utilities.secondsToTime(
  //     routeData.routePolyTimeUnit * 2
  //   )}`
  // );
  // console.log(
  //   `Margin of error (deviance allowed to OHD)(B->A): ${Utilities.secondsToTime(
  //     routeData.etuorPolyTimeUnit * 2
  //   )}`
  // );

  // console.log(
  //   "It takes ",
  //   Utilities.secondsToTime(
  //     routeData.a2TrueHalfway.rows[0].elements[0].duration.value
  //   ),
  //   " to get from Origin A to true halfway"
  // );

  // console.log(
  //   "It takes ",
  //   Utilities.secondsToTime(
  //     routeData.b2TrueHalfway.rows[0].elements[0].duration.value
  //   ),
  //   " to get from Origin B to true halfway "
  // );

  const onSelect = (item) => {
    setSelected(item);
  };

  const mapStyles = {
    height: '60vh',
    width: '60vw',
  };

  //TODO : optimize zoom

  //console.log(routeData.route.routes[0].legs[0]);

  // function optimiseZoom() {
  //   if (routeData.route.routes[0].legs[0].duration.value) {
  //   }
  // }

  //ABRes, BCRes, CARes, resObj
  //resObj: abRes, bcRes, caRes

  return (
    <LoadScript googleMapsApiKey={ApiKey}>
      {routeData?.resObj ? (
        <GoogleMap options={{ styles: silver }} mapContainerStyle={mapStyles} zoom={5} center={routeData.ABRes.location}>
          <Marker
            position={routeData.ABRes.location}
            title="Precise MidPoint"
            icon={Utilities.pinSymbol('red')}
            // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>

          <Marker
            position={routeData.BCRes.location}
            title="Origin A"
            // icon={marker}
            icon={Utilities.pinSymbol('yellow')}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>
          <Marker
            position={routeData.CARes.location}
            title="Origin B"
            // icon={marker}
            icon={Utilities.pinSymbol('blue')}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>

          <Marker
            position={routeData.resObj.abRes.location}
            title="Precise MidPoint"
            icon={Utilities.pinSymbol('orange')}
            // onClick={() => onSelect(routeData.precPolyMidPoint.location)}
          ></Marker>

          <Marker
            position={routeData.resObj.bcRes.location}
            title="Origin A"
            // icon={marker}
            icon={Utilities.pinSymbol('green')}
            // onClick={() => onSelect(route.routes[0].legs[0])}
          ></Marker>

          <Marker
            position={routeData.resObj.caRes.location}
            title="Origin B"
            // icon={marker}
            icon={Utilities.pinSymbol('purple')}
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
