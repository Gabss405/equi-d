'use strict';
const fetch = require('node-fetch');
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
  resRoutes.route = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=place_id:${params.origins.A}&destination=place_id:${params.origins.B}&mode=${params.origins.mode}&key=${anyApiKey}`);
  resRoutes.etuor = await fetchRequestHelper(DIRECTIONS_API_URL + `origin=place_id:${params.origins.B}&destination=place_id:${params.origins.A}&mode=${params.origins.mode}&key=${anyApiKey}`);

  return resRoutes;
}

async function fetchDistanceMatrix(start, end, mode) {
  let origin = `${start.lat},${start.lng}`;
  let destination = `${end.lat},${end.lng}`;
  return fetchRequestHelper(
    DISTANCE_MATRIX_API + `origins=${origin}&destinations=${destination}&mode=${mode}&key=${anyApiKey}` // use | pipe to pass more than one origin or destination
  );
}

async function fetchNearbyPlaces(location, radius, type) {
  let formattedLocation = `${location.lat},${location.lng}`;
  return fetchRequestHelper(PLACES_API + `location=${formattedLocation}&radius=500&type=${type}&key=${anyApiKey}`);
}

module.exports = { fetchDirection, fetchBothDirections, fetchDirectionsById, fetchDistanceMatrix, fetchRequestHelper, fetchNearbyPlaces };
