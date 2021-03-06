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

function pinSymbol(color) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 2,
    scale: 1,
  };
}

function optimiseZoom(routeObj) {
  let routeDistance = routeObj.routes[0].legs[0].distance.value;
  let zoomlevel = 5;
  if (routeDistance <= 200000) zoomlevel = 11;
  if (routeDistance <= 335364) zoomlevel = 10;
  if (routeDistance <= 1108239) zoomlevel = 8;
  if (routeDistance < 2000000) zoomlevel = 7;
  if (routeDistance < 3000000) zoomlevel = 6;
  if (routeDistance > 3000000) zoomlevel = 5;
  return zoomlevel;
}

const Utilities = {
  secondsToTime,
  pinSymbol,
  optimiseZoom,
};

export default Utilities;
