const { fetchMultiDistanceMatrix } = require('../services');
const getTrueHalfway = require('./utilities.halfway');

async function triangulate(a, b, c) {
  let abRes = await getTrueHalfway(a.location, b.location);
  let bcRes = await getTrueHalfway(b.location, c.location);
  let caRes = await getTrueHalfway(c.location, a.location);

  //fetchMultiDistanceMatrix takes a single arg of 2 or more location objs:
  //{ abRes, bcRes, caRes }
  //returns an object like: object.rows[0].elements[1].duration.value
  let abbccaDM = await fetchMultiDistanceMatrix({ abRes, bcRes, caRes });

  let abDuration = abbccaDM.rows[0].elements[1].duration.value;
  let bcDuration = abbccaDM.rows[1].elements[2].duration.value;
  let caDuration = abbccaDM.rows[2].elements[0].duration.value;
  //&& abbccaDM.rows[1].elements[2].duration > 600 && abbccaDM.rows[2].elements[0].duration

  if (abDuration > 600 && bcDuration > 600 && caDuration > 600) {
    console.log('recursion happening, buckle up!');
    return triangulate(abRes, bcRes, caRes);
  } else {
    console.log('found something!');
    console.log(abRes, bcRes, caRes);
    return { abRes, bcRes, caRes };
  }
  // return { abRes, bcRes, caRes };
}

module.exports = triangulate;
