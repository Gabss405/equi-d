function circumcircle(a, b, c) {
  // this.a = a
  // this.b = b
  // this.c = c

  var A = b.lat - a.lat;
  const B = b.lng - a.lng;
  const C = c.lat - a.lat;
  const D = c.lng - a.lng;
  const E = A * (a.lat + b.lat) + B * (a.lng + b.lng);
  const F = C * (a.lat + c.lat) + D * (a.lng + c.lng);
  const G = 2 * (A * (c.lng - b.lng) - B * (c.lat - b.lat));
  let minx;
  let miny;
  let dx;
  let dy;
  let result = {};
  // minx, miny, dx, dy

  /* If the points of the triangle are collinear, then just find the
   * extremes and use the midpoint as the center of the circumcircle. */
  if (Math.abs(G) < 0.000001) {
    minx = Math.min(a.lat, b.lat, c.lat);
    miny = Math.min(a.lng, b.lng, c.lng);
    dx = (Math.max(a.lat, b.lat, c.lat) - minx) * 0.5;
    dy = (Math.max(a.lng, b.lng, c.lng) - miny) * 0.5;

    result.lat = minx + dx;
    result.lng = miny + dy;
    result.r = dx * dx + dy * dy;
  } else {
    result.lat = (D * E - B * F) / G;
    result.lng = (A * F - C * E) / G;
    dx = result.lat - a.lat;
    dy = result.lng - a.lng;
    result.r = dx * dx + dy * dy;
  }

  return result;
}

module.exports = circumcircle;
