import './MapForm.css';
import { useState } from 'react';
import ApiServices from '../../services/ApiServices';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import PlacesAutocomplete from '../Places/PlacesAutocomplete';

import placeSuggestions from '../Places/places';
import logo from '../../assets/logo3.png';

const ApiKey = process.env.REACT_APP_API_KEY;

// const libraries = ["places"];

function MapForm({ setRouteData, setShowAnswer, setCity }) {
  // const [textOrigins, setNewTextOrigins] = useState({
  //   originA: "",
  //   originB: "",
  // });
  const [autocompleteOrigins, setNewAutocompleteOrigins] = useState({
    placeA: '',
    placeB: '',
  });
  const [libraries] = useState(['places']);
  const [autocompleteA, setAutocompleteA] = useState(null);
  const [autocompleteB, setAutocompleteB] = useState(null);

  // const [libraries] = useState(["places"]);
  // const [place, setNewPlace] = useState("");

  const onLoadA = (autocomplete) => {
    // console.log(autocomplete);
    setAutocompleteA(autocomplete);
  };
  const onLoadB = (autocomplete) => {
    // console.log(autocomplete);
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

  // const handleManualChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewTextOrigins({
  //     ...textOrigins,
  //     [name]: value,
  //   });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    ApiServices.fetchMidpointByPlaceIDService({
      placeA_id: autocompleteOrigins.placeA.place_id,
      placeB_id: autocompleteOrigins.placeB.place_id,
    })
      .then((res) => (res.status < 400 ? res : Promise.reject()))
      .then((res) => (res.status !== 204 ? res.json() : res))
      .then((res) => setRouteData(res))
      .catch((err) => {
        console.error('Fetch Error: ', err);
      });
    setShowAnswer(false);
    setCity('');

    // setNewAutocompleteOrigins({
    //   placeA: '',
    //   placeB: '',
    // });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(textOrigins);
  //   ApiServices.fetchMidpointByNameService({
  //     originA: textOrigins.originA,
  //     originB: textOrigins.originB,
  //   })
  //     .then((res) => (res.status < 400 ? res : Promise.reject()))
  //     .then((res) => (res.status !== 204 ? res.json() : res))
  //     .then((res) => setRouteData(res))
  //     .catch((err) => {
  //       console.error("Fetch Error: ", err);
  //     });

  //   setNewTextOrigins({ originA: "", originB: "" });

  // };

  return (
    <LoadScript googleMapsApiKey={ApiKey} libraries={libraries}>
      <div className="top-navbar">
        <div className="logo-container">
          {' '}
          <img className="logo" src={logo} />
        </div>
        <div className="equi-d"> Equi-d </div>
        <div className="inputs-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="autocomplete"></div>

            <div className="title">
              {/* <p>Origin A</p> */}
              <Autocomplete onLoad={onLoadA} fields={['place_id']} onPlaceChanged={handlePlaceChanged} value={autocompleteOrigins.placeA}>
                <input
                  type="text"
                  required={true}
                  // value={textOrigins.originA}
                  // name="originA"
                  // onChange={handleManualChange}
                  placeholder="enter address here..."
                  className="input"
                />
              </Autocomplete>
            </div>
            <button className="calculate-button">Find halfway...</button>
            <div className="title">
              <Autocomplete onLoad={onLoadB} fields={['place_id']} onPlaceChanged={handlePlaceChanged} value={autocompleteOrigins.placeB}>
                <input
                  type="text"
                  required={true}
                  // onFocus -- lok up in docs

                  // value={textOrigins.originB}
                  // name="originB"
                  // onChange={handleManualChange}
                  placeholder="enter address here..."
                  className="input"
                />
              </Autocomplete>
              <div>
                <PlacesAutocomplete suggestions={placeSuggestions}></PlacesAutocomplete>
              </div>
              {/* <p>Origin B</p> */}
            </div>
          </form>
        </div>
      </div>
    </LoadScript>
  );

  // function postEvent(title, date, venue) {
  //   ApiServices.postEventService({ title, date, venue }).then((newEvent) => {
  //     setEvents([...events, newEvent]);
  //   });
  // }
}

export default MapForm;
