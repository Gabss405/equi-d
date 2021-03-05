const { secondsToTime, polylineDecoder, polyTimeCalc, polyPrecision } = require('./utilities.helpers');
const { fetchDirections, fetchDirectionsCoord, fetchDistanceMatrix } = require('../services');

const getTrueHalfway = async (start, end) => {
  //1. fetch route objects from gmaps API, it returns two route objects in an object: routes.route is A->B and routes.etuor is B->A

  let routes = {};

  //console.log('start end within halfway', start, end);
  if (start.lat) {
    const res = await fetchDirectionsCoord(start, end);
    Object.assign(routes, res);
  } else {
    const res = await fetchDirections(start, end);
    Object.assign(routes, res);
  }

  // console.log(routes);
  //2. get the decoded polyline coordinates
  // returns an object of 2 arrays: .route and .etuor

  const decodedPolylines = await polylineDecoder(routes);

  //3. extract midpoint roughly on both arrays (returns an obj of 2 objs with props: .route and .etuor)

  const polylineMidCoords = {
    route: decodedPolylines.route[Math.floor(decodedPolylines.route.length / 2)],
    etuor: decodedPolylines.etuor[Math.floor(decodedPolylines.etuor.length / 2)],
  };
  //console.log("etuor mid", polylineMidCoords.etuor);

  //console.log(polylineMidCoords);
  // //4. fetching distance matrix to check how far in time provisional center is from start location  (start -> polylineMidCoords)
  const routePolyMidDM = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, polylineMidCoords.route.location);
  const etuorPolyMidDM = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, polylineMidCoords.etuor.location);

  // console.log(etuorPolyMidDM);

  // //5. calculate polyTimeUnit (total duration divided by total amount of polylines) to get a resolution,
  // // returns number of seconds it takes from one polyline to antoher on an average
  const routePolyTimeUnit = polyTimeCalc(routes.route, decodedPolylines.route);
  const etuorPolyTimeUnit = polyTimeCalc(routes.etuor, decodedPolylines.etuor);

  // console.log(routePolyTimeUnit);
  // console.log(etuorPolyTimeUnit);

  // //6. Polyprecision - if provisional center point is "behind" or "ahead" desired time based center,
  // //it returns desired polyline point coordinates based on time difference and polytimeUnit:
  const precPolyMidPointRoute = await polyPrecision(routes.route, decodedPolylines.route, routePolyMidDM, routePolyTimeUnit);
  const precPolyMidPointEtuor = await polyPrecision(routes.etuor, decodedPolylines.etuor, etuorPolyMidDM, etuorPolyTimeUnit);

  // console.log(precPolyMidPointRoute);
  // console.log(precPolyMidPointEtuor);

  //7. getting DM for A (start) to prec midpoint, and B (end) to compare travel times:
  const routePrecMidDM = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, precPolyMidPointRoute.location);
  const etuorPrecMidDM = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, precPolyMidPointEtuor.location);
  // console.log(etuorPrecMidDM);
  // console.log(
  //   secondsToTime(etuorPrecMidDM.rows[0].elements[0].duration.value)
  // );

  // console.log(precPolyMidPointEtuor);

  // let A = `${precPolyMidPointRoute.location.lat},${precPolyMidPointEtuor.location.lng}`;
  // let B = `${precPolyMidPointEtuor.location.lat},${precPolyMidPointEtuor.location.lng}`;

  // let trueHalfwayObj = await fetchRequestHelper(`https://maps.googleapis.com/maps/api/directions/json?` + `origin=${A}&destination=${B}&key=${anyApiKey}`);

  // const trueHalfway = trueHalfwayObj

  let trueHalfway = routePrecMidDM.rows[0].elements[0].duration.value < etuorPrecMidDM.rows[0].elements[0].duration.value ? precPolyMidPointEtuor : precPolyMidPointRoute;

  // const a2TrueHalfway = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, trueHalfway.location);
  // const b2TrueHalfway = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, trueHalfway.location);

  // const resObject = {
  //   route: routes.route,
  //   etour: routes.etuor,
  //   routePolyTimeUnit,
  //   etuorPolyTimeUnit,
  //   trueHalfway,
  //   a2TrueHalfway,
  //   b2TrueHalfway,
  // };

  // console.log(resObject);
  return trueHalfway;
};

module.exports = getTrueHalfway;
