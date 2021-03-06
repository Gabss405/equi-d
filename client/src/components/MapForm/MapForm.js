import { useEffect, useState } from 'react';
import { Autocomplete, LoadScript } from '@react-google-maps/api';

import './MapForm.css';
import logo from '../../assets/logo3.png';

import ApiServices from '../../services/ApiServices';
const ApiKey = process.env.REACT_APP_API_KEY;

function MapForm({ setRouteData, setShowAnswer, setCity }) {
  const [autocompleteOrigins, setNewAutocompleteOrigins] = useState({
    placeA: '',
    placeB: '',
  });
  const [libraries] = useState(['places']);
  const [autocompleteA, setAutocompleteA] = useState(null);
  const [autocompleteB, setAutocompleteB] = useState(null);
  const [travelMode, setTravelMode] = useState('driving');
  const [checked, setChecked] = useState({ driving: false, bicycling: false, walking: false });
  const [placeType, setPlaceType] = useState(null);

  const onLoadA = (autocomplete) => {
    setAutocompleteA(autocomplete);
  };
  const onLoadB = (autocomplete) => {
    setAutocompleteB(autocomplete);
  };

  const handlePlaceChanged = async () => {
    if (autocompleteA !== null && autocompleteB !== null)
      setNewAutocompleteOrigins({
        ...autocompleteOrigins,
        placeA: await autocompleteA.getPlace(),
        placeB: await autocompleteB.getPlace(),
      });
  };

  const onValueChange = (e) => {
    // e.preventDefault();
    setTravelMode(e.target.value);
    console.log(e.target.value);
    if (e.target.value === 'driving') setChecked({ driving: true, bicycling: false, walking: false });
    if (e.target.value === 'bicycling') setChecked({ driving: false, bicycling: true, walking: false });
    if (e.target.value === 'walking') setChecked({ driving: false, bicycling: false, walking: true });
    console.log(checked);
  };

  const handleChangeType = (e) => {
    console.log(e.target.value);
    if (e.target.value === 'none') setPlaceType(null);
    setPlaceType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ApiServices.fetchMidpointByPlaceIDService({
      placeA_id: autocompleteOrigins.placeA.place_id,
      placeB_id: autocompleteOrigins.placeB.place_id,
      mode: travelMode,
      type: placeType,
    })
      .then((res) => (res.status < 400 ? res : Promise.reject()))
      .then((res) => (res.status !== 204 ? res.json() : res))
      .then((res) => setRouteData(res))
      .catch((err) => {
        console.error('Fetch Error: ', err);
      });
    setShowAnswer(false);
    setCity('');
    setChecked({ driving: false, bicycling: false, walking: false });
  };

  return (
    <LoadScript googleMapsApiKey={ApiKey} libraries={libraries}>
      <div className="top-navbar">
        <div className="logo-and-title-container">
          <div className="logo-container">
            <img className="logo" src={logo} />
          </div>
          <div className="equi-d"> Equi-d </div>
        </div>
        <div className="inputs-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="origin">
              <p>Origin A</p>
              <Autocomplete onLoad={onLoadA} fields={['place_id']} onPlaceChanged={handlePlaceChanged} value={autocompleteOrigins.placeA}>
                <input spellCheck="false" type="text" required={true} placeholder="enter address here..." className="input" onDoubleClick={(e) => e.target.reset} />
              </Autocomplete>
            </div>
            <div className="map-form-middle">
              <div className="select-travel-mode" onChange={onValueChange}>
                Drive
                <input type="radio" value="driving" name="mode" className="driving" checked={travelMode === 'driving'} />
                Cycle
                <input type="radio" value="bicycling" name="mode" className="bicycling" checked={travelMode === 'bicycling'} />
                Walk
                <input type="radio" value="walking" name="mode" className="walking" checked={travelMode === 'walking'} />
              </div>
              <div className="middle-middle">
                <p className="poi-text">Find places of interest: </p>
                <div className="place-type-select">
                  <select value={placeType} onChange={handleChangeType} className="place-dropdown">
                    <option className="option" value="none">
                      None
                    </option>
                    <option className="option" value="art_gallery">
                      Art Galleries
                    </option>
                    <option className="option" value="bar">
                      Bars
                    </option>
                    <option className="option" value="cafe">
                      Cafes
                    </option>
                    <option className="option" value="campground">
                      Campgrounds
                    </option>
                    <option className="option" value="movie-theatre">
                      Cinemas
                    </option>
                    <option className="option" value="museum">
                      Museums
                    </option>
                    <option className="option" value="night_club">
                      Clubs
                    </option>
                    <option className="option" value="park">
                      Parks
                    </option>
                    <option className="option" value="restaurant">
                      Restaurants
                    </option>
                    <option className="option" value="shopping_mall">
                      Shopping Mall
                    </option>
                    <option className="option" value="tourist_attraction">
                      Tourist Attractions
                    </option>
                  </select>
                </div>
              </div>
              <button className="calculate-button">Meet in the middle</button>
            </div>
            <div className="origin">
              <p>Origin B</p>
              <Autocomplete onLoad={onLoadB} fields={['place_id']} onPlaceChanged={handlePlaceChanged} value={autocompleteOrigins.placeB}>
                <input spellCheck="false" type="text" required={true} placeholder="enter address here..." className="input" />
              </Autocomplete>
            </div>
          </form>
        </div>
      </div>
    </LoadScript>
  );
}

export default MapForm;
