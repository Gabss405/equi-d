// import ApiServices from "../services/ApiServices";
// import polyline from "polyline";

function secondsToTime(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

// ///////////////////////// POLYLINE MALARKEY START ///////////////////////////////
// // takes a route object and creates array of all polylines from route

// async function polylineDecoder(route) {
//   let routePolylineCoordinates = [];
//   polyline
//     .decode(route.routes[0].overview_polyline.points)
//     .forEach((item, index) => {
//       routePolylineCoordinates.push({
//         id: index + Date.now(),
//         location: { lat: item[0], lng: item[1] },
//       });
//     });
//   return routePolylineCoordinates;
// }

// // let routePolylineMidPointCoordinates =
// //   routePolylineCoordinates[Math.floor(routePolylineCoordinates.length / 2)];
// // routePolylineMidPointCoordinates.address = `Halfway (distance) between ${route.routes[0].legs[0].start_address} and ${route.routes[0].legs[0].end_address}`;

// // if (Object.keys(revRoute).length !== 0) {
// //   polyline
// //     .decode(revRoute.routes[0].overview_polyline.points)
// //     .forEach((item, index) => {
// //       // setRoutePolylineCoordinates(...routePolylineCoordinates, {
// //       //   id: index + Date.now(),
// //       //   location: { lat: item[0], lng: item[1] },
// //       // });
// //       revRoutePolylineCoordinates.push({
// //         id: index + Date.now(),
// //         location: { lat: item[0], lng: item[1] },
// //       });
// //     });
// //   revRoutePolylineMidPointCoordinates =
// //     revRoutePolylineCoordinates[
// //       Math.floor(revRoutePolylineCoordinates.length / 2)
// //     ];
// //   revRoutePolylineMidPointCoordinates.address = `Halfway (distance) between ${revRoute.routes[0].legs[0].start_address} and ${revRoute.routes[0].legs[0].end_address}`;
// // }
// //console.log(routePolylineMidPointCoordinates);
// ///////////////////////// POLYLINE MALARKEY END///////////////////////////////

// ///////////////////////// POLYSPEED MALARKEY START ///////////////////////////////
// // calculate how lng it takes on an average to get from one polyline points to another
// // so we can better guess what the mid polyline (duration-wise) will be
// // polytimeUnit is the amount of seconds it takes to travel bewteen two adjacent polyline points
// // takes route object and array of polyline coordinates
// // returns: number of seconds

// function polyTimeUnit(route, polyline) {
//   return Math.floor(route.routes[0].legs[0].duration.value / polyline.length);
// }

// ///////////////////////// POLYSPEED MALARKEY END///////////////////////////////
// ///////////////////////// DISTANCE MATRIX MALARKEY START ///////////////////////////////

// //takes two sets of coordinates: {lat: xxx lng: xxx} and returns distance matrix object:

// async function getDistanceMatrix(start, end) {
//   // let distanceMatrix = {};

//   let origin = `${start.lat},${start.lng}`;
//   let destination = `${end.lat},${end.lng}`;

//   return ApiServices.fetchDistanceMatrixService(origin, destination);
//   // .then(
//   //   (fetchedMatrix) => {
//   //     Object.assign(distanceMatrix, fetchedMatrix);
//   //     //distanceMatrix = fetchedMatrix;
//   //     // console.log(typeof distanceMatrix);
//   //   }
//   // );
//   // // console.log("distanceMatrix fetched:", typeof distanceMatrix);
//   // return distanceMatrix;
// }

// ///////////////////////// DISTANCE MATRIX MALARKEY END ///////////////////////////////
// ///////////////////////// POLYPRECISION MALARKEY START ///////////////////////////////

// // takes a route, a polyline, a distance matrix object and a polytime unit,
// // //if duration to geopgraphical midpoint (polyhalfway) is shorter (in time) than desired halfway in duration (need to go forward a bit)
// // then time difference must be expressed in amount of polyline points (based on polyspeed)
// // else if longer then the other way around
// // returns the closest polyline coordinate to halfway time (coordinates obj)

// function polyPrecision(route, polyline, distancematrix, polytimeunit) {
//   let durationToProvisionalHalfway =
//     distancematrix.rows[0].elements[0].duration.value;

//   let desiredHalfwayduration = route.routes[0].legs[0].duration.value / 2;

//   if (durationToProvisionalHalfway < desiredHalfwayduration) {
//     let posDiff = Math.floor(
//       (desiredHalfwayduration - durationToProvisionalHalfway) / polytimeunit
//     );
//     return polyline[Math.floor(polyline.length / 2) + posDiff];
//   } else {
//     let negDiff = Math.floor(
//       (durationToProvisionalHalfway - desiredHalfwayduration) / polytimeunit
//     );
//     return polyline[Math.floor(polyline.length / 2) - negDiff];
//   }
// }

// ///////////////////////// POLYPRECISION MALARKEY END ///////////////////////////////

// ///////////////////////// STEP DURATION MALARKEY START ///////////////////////////////
// //it still might be usedful as a first check maybe theres a step right in the middle?

// // const halfwayInTime = route.routes[0].legs[0].duration.value / 2;
// // const revHalfwayInTime = revRoute.routes[0].legs[0].duration.value / 2;
// // let stepDurationAccumulator = 0;
// // let halfwayStep = route.routes[0].legs[0].steps.find((step, idx) => {
// //   if (
// //     stepDurationAccumulator / (route.routes[0].legs[0].duration.value / 100) <
// //     49
// //   ) {
// //     stepDurationAccumulator += step.duration.value;
// //   } else {
// //     console.log(
// //       Math.floor(
// //         stepDurationAccumulator /
// //           (route.routes[0].legs[0].duration.value / 100)
// //       ) +
// //         "% of the way at light green marker, it takes " +
// //         secondsToTime(stepDurationAccumulator) +
// //         " seconds to get there (total travel time is " +
// //         secondsToTime(route.routes[0].legs[0].duration.value) +
// //         ")"
// //     );
// //     return step;
// //   }
// // let revStepDurationAccumulator = 0;
// // let revHalfwayStep = revRoute.routes[0].legs[0].steps.find((step, idx) => {
// //   let revRoutePercentageDone =
// //     revStepDurationAccumulator /
// //     (revRoute.routes[0].legs[0].duration.value / 100);
// //   if (revRoutePercentageDone < 49) {
// //     revStepDurationAccumulator += step.duration.value;
// //   } else {
// //     console.log(
// //       Math.floor(
// //         revStepDurationAccumulator /
// //           (revRoute.routes[0].legs[0].duration.value / 100)
// //       ) +
// //         "% of the way at light blue marker,  it takes " +
// //         secondsToTime(revStepDurationAccumulator) +
// //         " seconds to get there. (total travel time is " +
// //         secondsToTime(revRoute.routes[0].legs[0].duration.value) +
// //         ")"
// //     );
// //     return step;
// //   }
// // });
// // console.log("halfway step", halfwayStep.start_location);
// // console.log("revhalfway step", revHalfwayStep.start_location);
// ///////////////////////// STEP DURATION MALARKEY END ///////////////////////////////
// //////////////////////// CALCULATING HALFWAY STEP OF HALFWAY STEPS /////////////////////
// // console.log(halfwayStep.start_location);
// // console.log(revHalfwayStep.start_location);
// // let routeBetweenHalfwaySteps = {};
// // ApiServices.fetchDirectionsService({
// //   originA: `${halfwayStep.start_location.lat}+${halfwayStep.start_location.lng}`,
// //   originB: `${revHalfwayStep.start_location.lat}+${revHalfwayStep.start_location.lng}`,
// // }).then((fetchedRoute) => {
// //   routeBetweenHalfwaySteps = fetchedRoute;
// //   console.log("Route between halfway steps ", routeBetweenHalfwaySteps);
// // });
// //////////////////////// CALCULATING HALFWAY STEP OF HALFWAY STEPS END /////////////////////
// //////////////////////displaying current location:
// // const success = (position) => {
// //   const currentPosition = {
// //     lat: position.coords.latitude,
// //     lng: position.coords.longitude,
// //   };
// //   setCurrentPosition(currentPosition);
// // };
// // useEffect(() => {
// //   navigator.geolocation.getCurrentPosition(success);
// // });

// const Utilities_Midroute = {
//   secondsToTime,
//   polylineDecoder,
//   polyTimeUnit,
//   getDistanceMatrix,
//   polyPrecision,
// };

const Utilities = {
  secondsToTime,
};

export default Utilities;
