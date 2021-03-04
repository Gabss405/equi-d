"use strict";

const { fetchDirections, fetchDistanceMatrix } = require("./services");
const {
  secondsToTime,
  polylineDecoder,
  polyTimeCalc,
  polyPrecision,
} = require("./utilities");

//TODO : when triangulate compare route from first halfpoint to point in front
//TODO : compare total duration travelled by all parties to other solutions
//TODO : refactor function in utils so it calculates this from route[0].legs[0].duration.value:

exports.getRoute = async (req, res) => {
  try {
    //1. fetch route object from gmaps API
    const route = await fetchDirections(req.params);

    //2. get the decoded polyline coordinates:
    const decodedPolyline = await polylineDecoder(route);

    //3. set midpoint roughly
    const polylineMiddleCoordinates =
      decodedPolyline[Math.floor(decodedPolyline.length / 2)];

    //4. fetching distance matrix to check how far in time provisional center is from start location  (start -> polylineMiddleCoordinates)
    const a2polyMidDM = await fetchDistanceMatrix(
      route.routes[0].legs[0].start_location,
      polylineMiddleCoordinates.location
    );
    //5. calculate polyTimeUnit (total duration divided by total amount of polylines) to get a resolution,
    // returns number of seconds it takes from one polyline to antoher on an average
    const polyTimeUnit = polyTimeCalc(route, decodedPolyline);

    //6. Polyprecision - if provisional center point is "behind" or "ahead" desired time based center,
    //it returns desired polyline point coordinates based on time difference and polytimeUnit:
    const precPolyMidPoint = await polyPrecision(
      route,
      decodedPolyline,
      a2polyMidDM,
      polyTimeUnit
    );

    //7. getting DM for A (start) to prec midpoint, and B (end) to compare travel times:
    const a2MidpointDM = await fetchDistanceMatrix(
      route.routes[0].legs[0].start_location,
      precPolyMidPoint
    );
    const b2MidpointDM = await fetchDistanceMatrix(
      route.routes[0].legs[0].end_location,
      precPolyMidPoint
    );

    console.log(precPolyMidPoint.location);

    const resObject = {
      route,
      polyTimeUnit,
      precPolyMidPoint,
      a2MidpointDM,
      b2MidpointDM,
    };

    res.send(resObject);
    res.status(200);
  } catch (error) {
    console.log("GET ROUTE ERROR:", error);
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
