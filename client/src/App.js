import { useEffect, useState } from 'react';

import './App.css';
import MapForm from './components/MapForm/MapForm';
import Map from './components/Map/Map';
import ApiServices from './services/ApiServices';

function App() {
  const [routeData, setRouteData] = useState({});

  const [city, setCity] = useState('');
  const [landingZoom, setLandingZoom] = useState(9);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    ApiServices.fetchRandomCity()
      .then((res) => (res.status < 400 ? res : Promise.reject()))
      .then((res) => (res.status !== 204 ? res.json() : res))
      .then((res) => setCity(res))
      .catch((err) => {
        console.error('Fetch Error: ', err);
      });
  }, []);

  const handleClick = () => {
    setShowAnswer(true);
    setLandingZoom(landingZoom - 2);
  };

  // console.log(city);

  return (
    <div className="app-container">
      <header className="map-form-container" style={{ position: 'absolute', zIndex: '3' }}>
        <MapForm setRouteData={setRouteData} setCity={setCity} setShowAnswer={setShowAnswer} />
      </header>

      {Object.keys(routeData).length > 0 ? (
        <div className="all-maps-container">
          <div className="result-map" style={{ position: 'relative', zIndex: '2' }}>
            <Map routeData={routeData} />
          </div>
        </div>
      ) : (
        <div className="all-maps-container">
          <div className="result-map" style={{ position: 'relative', zIndex: '2' }}>
            <Map routeData={false} randomCity={city} landingZoom={landingZoom} />
          </div>
        </div>
      )}

      <footer className="footer-container" style={{ position: 'fixed', zIndex: '3' }}>
        <div className="footer-copyright">
          <div>Copyright © 2019, All Right Reserved Equi-d</div>
        </div>
        <div className="game">
          <button className="where-is-this" onClick={handleClick}>
            Where is this?
          </button>
          {showAnswer ? (
            <div className="answer">
              {city.name + ','} {city.country}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="footer-social-media">
          powered by{' '}
          <a className="google-link" href="https://developers.google.com/maps">
            Google Maps API{' '}
          </a>
          🙏💚
        </div>
        <div className="footer-rest">
          <a className="tcp" href="http://equid.com/terms">
            {' '}
            Terms
          </a>
          <a className="tcp" href="http://equid.com/contact">
            {' '}
            Contact
          </a>
          <a className="tcp" href="http://equid.com/privacy">
            {' '}
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
