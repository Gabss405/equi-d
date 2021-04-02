import { Marker, InfoWindow } from '@react-google-maps/api';
import Utilities from '../../utilities/Utilities';

export default function Places({ nearbyPlaces }) {
  const places = nearbyPlaces.results.map((item) => {
    return (
      <Marker key={item.place_id} position={item.geometry.location} title={item.name} rating={item.rating} icon={Utilities.pinSymbol('blue')}>
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

  return (
    <>
      <div className="places-container">{!places.length ? <></> : places}</div>
    </>
  );
}
