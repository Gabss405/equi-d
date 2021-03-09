'use strict';

const polyline = require('@mapbox/polyline'); // encodes and decodees polylines https://www.npmjs.com/package/@mapbox/polyline

function secondsToTime(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
}

///////////////////////// POLYLINE MALARKEY START ///////////////////////////////
// takes a route object and returns array of all polylines from route

async function polylineDecoderMulti(routes, mode) {
  let routePolylineCoordinates = {};

  routePolylineCoordinates.route = [];
  routePolylineCoordinates.etuor = [];

  if (mode === 'driving') {
    polyline.decode(routes.route.routes[0].overview_polyline.points).forEach((item, index) => {
      routePolylineCoordinates.route.push({
        id: index + Date.now(),
        location: { lat: item[0], lng: item[1] },
      });
    });

    polyline.decode(routes.etuor.routes[0].overview_polyline.points).forEach((item, index) => {
      routePolylineCoordinates.etuor.push({
        id: index + Date.now(),
        location: { lat: item[0], lng: item[1] },
      });
    });

    return routePolylineCoordinates;
  } else if (mode === 'bicycling' || mode === 'walking') {
    polyline.decode(routes.route.routes[0].overview_polyline.points).forEach((item, index) => {
      routePolylineCoordinates.route.push({
        id: index + Date.now(),
        location: { lat: item[0], lng: item[1] },
      });
    });

    polyline.decode(routes.etuor.routes[0].overview_polyline.points).forEach((item, index) => {
      routePolylineCoordinates.etuor.push({
        id: index + Date.now(),
        location: { lat: item[0], lng: item[1] },
      });
    });
  }
  return routePolylineCoordinates;
}

async function polylineDecoder(route, mode) {
  //console.log(route.routes[0]);
  let routePolylineCoordinates = [];
  if (mode === 'driving') {
    polyline.decode(route.routes[0].overview_polyline.points).forEach((item) => {
      routePolylineCoordinates.push({ lat: item[0], lng: item[1] });
    });
  } else if (mode === 'bicycling' || mode === 'walking') {
    polyline.decode(route.routes[0].overview_polyline.points).forEach((item) => {
      routePolylineCoordinates.push({ lat: item[0], lng: item[1] });
    });
  }
  //console.log(routePolylineCoordinates);
  return routePolylineCoordinates;
}

///////////////////////// POLYLINE MALARKEY END///////////////////////////////

///////////////////////// POLYSPEED MALARKEY START ///////////////////////////////
// calculate how lng it takes on an average to get from one polyline points to another
// so we can better guess what the mid polyline (duration-wise) will be
// polytimeUnit is the amount of seconds it takes to travel bewteen two adjacent polyline points
// takes route object and array of polyline coordinates
// returns: number of seconds

function polyTimeCalc(route, polyline) {
  return Math.floor(route.routes[0].legs[0].duration.value / polyline.length);
}

///////////////////////// POLYSPEED MALARKEY END///////////////////////////////

///////////////////////// POLYPRECISION MALARKEY START ///////////////////////////////

// takes a route, a polyline, a distance matrix object and a polytime unit,
// //if duration to geopgraphical midpoint (polyhalfway) is shorter (in time) than desired halfway in duration (need to go forward a bit)
// then time difference must be expressed in amount of polyline points (based on polyspeed)
// else if longer then the other way around
// returns the closest polyline coordinate to halfway time (coordinates obj)

function polyPrecision(route, polyline, distancematrix, polytimeunit) {
  let durationToProvisionalHalfway = distancematrix.rows[0].elements[0].duration.value;

  let desiredHalfwayduration = route.routes[0].legs[0].duration.value / 2;

  if (durationToProvisionalHalfway < desiredHalfwayduration) {
    let posDiff = Math.floor((desiredHalfwayduration - durationToProvisionalHalfway) / polytimeunit);
    return polyline[Math.floor(polyline.length / 2) + posDiff];
  } else {
    let negDiff = Math.floor((durationToProvisionalHalfway - desiredHalfwayduration) / polytimeunit);
    return polyline[Math.floor(polyline.length / 2) - negDiff];
  }
}

///////////////////////// POLYPRECISION MALARKEY END ///////////////////////////////

module.exports = {
  secondsToTime,
  polylineDecoder,
  polylineDecoderMulti,
  polyTimeCalc,
  polyPrecision,
};
