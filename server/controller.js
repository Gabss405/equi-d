'use strict';

const { fetchDirections, fetchDistanceMatrix } = require('./services');
const { secondsToTime, polylineDecoder, polyTimeCalc, polyPrecision } = require('./utilities');

//TODO : when triangulate compare route from first halfpoint to point in front
//TODO : compare total duration travelled by all parties to other solutions
//TODO : refactor function in utils so it calculates this from route[0].legs[0].duration.value:

exports.getRoute = async (req, res) => {
  try {
    //1. fetch route objects from gmaps API, it returns two route objects in an object: routes.route is A->B and routes.etuor is B->A
    const routes = await fetchDirections(req.params);
    // console.log(routes.etuor);
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

    // [Math.floor(decodedPolylines.route.length / 2)]

    let trueHalfway = routePrecMidDM.rows[0].elements[0].duration.value < etuorPrecMidDM.rows[0].elements[0].duration.value ? precPolyMidPointEtuor : precPolyMidPointRoute;

    const a2TrueHalfway = await fetchDistanceMatrix(routes.route.routes[0].legs[0].start_location, trueHalfway.location);
    const b2TrueHalfway = await fetchDistanceMatrix(routes.etuor.routes[0].legs[0].start_location, trueHalfway.location);

    const resObject = {
      route: routes.route,
      etour: routes.etuor,
      routePolyTimeUnit,
      etuorPolyTimeUnit,
      trueHalfway,
      a2TrueHalfway,
      b2TrueHalfway,
    };

    res.send(resObject);
    res.status(200);
  } catch (error) {
    console.log('GET ROUTE ERROR:', error);
  }
};

// exports.postNewTopic = async (req, res) => {
//   try {
//     const { title, favNumber } = req.body;
//     const newTopic = await Topic.create({title: title, favNumber})
//     res.status(201);
//     res.send(newTopic);

//   } catch (error) {
//     console.log('POST ERROR', error)
//     res.status(500);
//     res.send(error);
//   }

// }

// exports.deleteTopic = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Topic.findByIdAndDelete(id)
//     res.sendStatus(204);

//   } catch (error) {
//     console.log('DELETE TOPIC ERROR:', error)
//     res.status(500);
//     res.send(error);
//   }

// }

// exports.voteUp = async (req, res) => {
//   // console.log(dir)
//   voteTopic(req, res, 1);
// }
// exports.voteDown = async (req, res) => voteTopic(req, res, -1);

// const voteTopic = async (req, res, dir) => {
//   // console.log(dir)
//   try {
//     const { id } = req.params;
//     console.log(id);
//     const topic = await Topic.findByIdAndUpdate(id,
//       { $inc: {score: dir}},
//       { new: true }
//       );
//     res.send(topic);

//   } catch (error) {
//     console.log('UPDATE TOPIC ERROR:', error)
//     res.status(500);
//     res.send(error);
//   }

// }
