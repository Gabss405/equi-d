'use strict';
const fetch = require('node-fetch');
// const { anyApiKey } = require("./config");
const anyApiKey = process.env.API_KEY;

const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json?';

const DISTANCE_MATRIX_API = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

const PLACES_API = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';

function fetchRequestHelper(path, options) {
  return fetch(path)
    .then((res) => {
      return res.status < 400 ? res : Promise.reject();
    })
    .then((res) => (res.status !== 204 ? res.json() : res))
    .catch((err) => {
      console.error('Fetch Error: ', err);
    });
}

async function fetchDirection(start, end, mode) {
  let origin = `${start.lat},${start.lng}`;
  let destination = `${end.lat},${end.lng}`;
  //fetching A->B route obj:
  let resRoute = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${origin}&destination=${destination}&mode=${mode}&key=${anyApiKey}`);
  return resRoute;
}

async function fetchBothDirections(origins) {
  const params = { origins };
  const resRoutes = {};
  //fetching A->B route obj:
  resRoutes.route = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${params.origins.A}&destination=${params.origins.B}&key=${anyApiKey}`);
  //fetching B->A route obj:
  resRoutes.etuor = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=${params.origins.B}&destination=${params.origins.A}&key=${anyApiKey}`);

  return resRoutes;
}
async function fetchDirectionsById(origins) {
  const params = { origins };
  const resRoutes = {};
  //fetching A->B route obj:
  // console.log(DIRECTIONS_API_URL + `origin=place_id:${params.origins.A}&destination=place_id:${params.origins.B}&mode=${params.origins.mode}&key=${anyApiKey}`);
  resRoutes.route = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=place_id:${params.origins.A}&destination=place_id:${params.origins.B}&mode=${params.origins.mode}&key=${anyApiKey}`);
  //fetching B->A route obj:
  resRoutes.etuor = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=place_id:${params.origins.B}&destination=place_id:${params.origins.A}&mode=${params.origins.mode}&key=${anyApiKey}`);

  return resRoutes;
}

async function fetchDistanceMatrix(start, end, mode) {
  let origin = `${start.lat},${start.lng}`;
  let destination = `${end.lat},${end.lng}`;
  // console.log(DISTANCE_MATRIX_API + `origins=${origin}&destinations=${destination}&mode=${mode}&key=${anyApiKey}`);
  return fetchRequestHelper(
    DISTANCE_MATRIX_API + `origins=${origin}&destinations=${destination}&mode=${mode}&key=${anyApiKey}` // use | pipe to pass more than one origin or destination
  );
}

async function fetchNearbyPlaces(location, radius, type) {
  let formattedLocation = `${location.lat},${location.lng}`;
  return fetchRequestHelper(PLACES_API + `location=${formattedLocation}&radius=500&type=${type}&key=${anyApiKey}`);
}

// https://maps.googleapis.com/maps/api/directions/json?
// origin=Toronto&destination=Montreal
// &avoid=highways &mode=bicycling
// &key=

// https://maps.googleapis.com/maps/api/directions/json?
// origin=Toronto&destination=Montreal
// &avoid=highways&mode=bicycling
// &key=YOUR_API_KEY

//https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=YOUR_API_KEY

// http://maps.googleapis.com/maps/api/directions/json?origin=41.8781139,-87.6297872&destination=40.6655101,-73.891889&key=YOUR_API_KEY

//https://maps.googleapis.com/maps/api/distancematrix/json?origins=41.8781139,-87.6297872&destinations=113%2035.14811,-90.40892&key=YOUR_API_KEY

//https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101,-73.89188969999998&destinations=35.14811,-90.40892&key=YOUR_API_KEY
module.exports = { fetchDirection, fetchBothDirections, fetchDirectionsById, fetchDistanceMatrix, fetchRequestHelper, fetchNearbyPlaces };

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.51092,-0.11344&radius=1500&type=bar&key=
// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.70862,-73.93267&radius=500&type=bar&key=

// https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&key=YOUR_API_KEY
