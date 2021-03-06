'use strict';
const fetch = require('node-fetch');
const anyApiKey = process.env.API_KEY;

const GEOCODING_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json?';

const DISTANCE_MATRIX_API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

function fetchRequestHelper(path, options) {
  return fetch(path)
    .then((res) => (res.status < 400 ? res : Promise.reject()))
    .then((res) => (res.status !== 204 ? res.json() : res))
    .catch((err) => {
      console.error('Fetch Error: ', err);
    });
}

///////////////////  DIRECTIONS API ///////////////////
async function fetchDirections(start, end) {
  const resRoutes = {};
  //fetching A->B route obj:
  resRoutes.route = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${start}&destination=${end}&key=${anyApiKey}`);
  //fetching B->A route obj:
  resRoutes.etuor = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${end}&destination=${start}&key=${anyApiKey}`);
  return resRoutes;
}

async function fetchDirectionsByCoord(start, end) {
  let origin = `${start.lat},${start.lng}`;
  let destination = `${end.lat},${end.lng}`;
  const resRoutes = {};
  resRoutes.route = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${origin}&destination=${destination}&key=${anyApiKey}`);
  //fetching B->A route obj:
  resRoutes.etuor = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${destination}&destination=${origin}&key=${anyApiKey}`);

  return resRoutes;
}

///////////////////  DISTANCEMATRIX API ///////////////////

function fetchDistanceMatrix(start, end) {
  console.log((start, end));
  // if (start.location) console.log(start.location);
  let origin = `${start.lat},${start.lng}`;
  let destination = `${end.lat},${end.lng}`;
  return fetchRequestHelper(
    DISTANCE_MATRIX_API_URL + `origins=${origin}&destinations=${destination}&key=${anyApiKey}` // use | pipe to pass more than one origin or destination
  );
}

function fetchMultiDistanceMatrix(coordinates) {
  let origins = `${coordinates.abRes.location.lat},${coordinates.abRes.location.lng}|${coordinates.bcRes.location.lat},${coordinates.bcRes.location.lng}|${coordinates.caRes.location.lat},${coordinates.caRes.location.lng}`;
  let destinations = `${coordinates.abRes.location.lat},${coordinates.abRes.location.lng}|${coordinates.bcRes.location.lat},${coordinates.bcRes.location.lng}|${coordinates.caRes.location.lat},${coordinates.caRes.location.lng}`;

  return fetchRequestHelper(
    DISTANCE_MATRIX_API_URL + `origins=${origins}&destinations=${destinations}&key=${anyApiKey}` // use | pipe to pass more than one origin or destination
  );
}

///////////////////  GEOCODING API ///////////////////

function fetchGeocoding(address) {
  let formattedAddress = address.replace(/[^a-zA-Z0-9\s]/gi, '').replace(/ /gi, '%20');

  // console.log(formattedAddress);

  return fetchRequestHelper(GEOCODING_API_URL + `address=${formattedAddress}` + `&key=${anyApiKey}`);
}
//12 Street St, London, UK

//https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

// http://maps.googleapis.com/maps/api/directions/json?origin=Chicago&destination=Austin&key=YOUR_API_KEY

//https://maps.googleapis.com/maps/api/distancematrix/json?origins=41.8781139,-87.6297872&destinations=113%2035.14811,-90.40892&key=YOUR_API_KEY

//https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101,-73.89188969999998&destinations=35.14811,-90.40892&key=YOUR_API_KEY

module.exports = { fetchDirections, fetchDistanceMatrix, fetchRequestHelper, fetchDirectionsByCoord, fetchMultiDistanceMatrix, fetchGeocoding };
