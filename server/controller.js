'use strict';

const { fetchBothDirections, fetchDirectionsById, fetchDistanceMatrix, fetchDirection, fetchNearbyPlaces } = require('./services');
const { polylineDecoder, polylineDecoderMulti, polyTimeCalc, polyPrecision } = require('./utilities');
const polyline = require('@mapbox/polyline');
const cities = require('./cities.json');
const lookup = require('country-code-lookup');

exports.getRandomCity = async (_, res) => {
  try {
    const randomCity = await cities[Math.floor(Math.random() * cities.length)];
    const randomCityCountry = lookup.byIso(randomCity.country).country;

    res.status(201);
    res.send({ name: randomCity.name, country: randomCityCountry, location: { lat: +randomCity.lat, lng: +randomCity.lng } });
  } catch (error) {
    console.log('GET ERROR', error);
    res.status(500);
    res.send(error);
  }
};

exports.getRoute = async (req, res) => {
  console.log('in the controller', req.params.type);
  try {
    //1. fetch route objects from gmaps API, it returns two route objects in an object: routes.route is A->B and routes.etuor is B->A

    const routes = await fetchDirectionsById(req.params);

    //2. get the decoded polyline coordinates
    // returns an object of 2 arrays: .route and .etuor

    const decodedPolylines = await polylineDecoderMulti(routes, req.params.mode);

    // //3. extract midpoint roughly on both arrays (returns an obj of 2 objs with props: .route and .etuor)

    const polylineMidCoords = {
      route: decodedPolylines.route[Math.floor(decodedPolylines.route.length / 2)],
      etuor: decodedPolylines.etuor[Math.floor(decodedPolylines.etuor.length / 2)],
    };

    // // //4. fetching distance matrix to check how far in time provisional center is from start location  (start -> polylineMidCoords)
    const routePolyMidDM = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, polylineMidCoords.route.location, req.params.mode);
    const etuorPolyMidDM = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, polylineMidCoords.etuor.location, req.params.mode);

    // // //5. calculate polyTimeUnit (total duration divided by total amount of polylines) to get a resolution,
    // // // returns number of seconds it takes from one polyline to antoher on an average
    const routePolyTimeUnit = polyTimeCalc(routes.route, decodedPolylines.route);
    const etuorPolyTimeUnit = polyTimeCalc(routes.etuor, decodedPolylines.etuor);

    // // //6. Polyprecision - if provisional center point is "behind" or "ahead" desired time based center,
    // // //it returns desired polyline point coordinates based on time difference and polytimeUnit:
    const precPolyMidPointRoute = await polyPrecision(routes.route, decodedPolylines.route, routePolyMidDM, routePolyTimeUnit);
    const precPolyMidPointEtuor = await polyPrecision(routes.etuor, decodedPolylines.etuor, etuorPolyMidDM, etuorPolyTimeUnit);

    // //7. getting DM for A (start) to prec midpoint, and B (end) to compare travel times:
    const routePrecMidDM = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, precPolyMidPointRoute.location, req.params.mode);
    const etuorPrecMidDM = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, precPolyMidPointEtuor.location, req.params.mode);

    let trueHalfway = routePrecMidDM.rows[0].elements[0].duration.value < etuorPrecMidDM.rows[0].elements[0].duration.value ? precPolyMidPointEtuor : precPolyMidPointRoute;

    let nearbyPlaces = [];
    if (req.params.type !== 'null') nearbyPlaces = await fetchNearbyPlaces(trueHalfway.location, 500, req.params.type);

    const a2TrueHalfwayDirections = await fetchDirection(routes.route.routes[0].legs[0].start_location, trueHalfway.location, req.params.mode);
    const b2TrueHalfwayDirections = await fetchDirection(routes.etuor.routes[0].legs[0].start_location, trueHalfway.location, req.params.mode);

    const a2TrueHalfwayDecodedPolyline = await polylineDecoder(a2TrueHalfwayDirections, req.params.mode);
    const b2TrueHalfwayDecodedPolyline = await polylineDecoder(b2TrueHalfwayDirections, req.params.mode);

    const a2TrueHalfwayDecodedPolylineMidPoint = a2TrueHalfwayDecodedPolyline[Math.floor(a2TrueHalfwayDecodedPolyline.length / 2)];
    const b2TrueHalfwayDecodedPolylineMidPoint = b2TrueHalfwayDecodedPolyline[Math.floor(b2TrueHalfwayDecodedPolyline.length / 2)];

    const resObject = {
      route: routes.route,
      etuor: routes.etuor,
      routePolyTimeUnit,
      etuorPolyTimeUnit,
      trueHalfway,
      a2TrueHalfwayDirections,
      b2TrueHalfwayDirections,
      a2TrueHalfwayDecodedPolyline,
      b2TrueHalfwayDecodedPolyline,
      a2TrueHalfwayDecodedPolylineMidPoint,
      b2TrueHalfwayDecodedPolylineMidPoint,
      nearbyPlaces,
    };

    res.send(resObject);
    res.status(200);
  } catch (error) {
    console.log('GET ROUTE ERROR:', error);
  }
};
