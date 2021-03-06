'use strict';

const { fetchMultiDistanceMatrix } = require('./services');

const getTrueHalfway = require('./utilities/utilities.halfway');
//import getTrueHalfway from './utilities/halfway';
// const halfway = require('./utilities/utilities.halfway');
//TODO : when triangulate compare route from first halfpoint to point in front
//TODO : compare total duration travelled by all parties to other solutions
//TODO : refactor function in utils so it calculates this from route[0].legs[0].duration.value:

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

exports.calcCentroid = async (req, res) => {
  //console.log(req.params);
  const A = req.params.A;
  const B = req.params.B;
  const C = req.params.C;

  // getTrueHalfway(A,B);
  // console.log(A, B, C);

  //Get true halfway beetween vertices of first triangle,
  //takes two Cities, location names as string or 2 LatLng objects ({lat: 44, lng: -54})
  //return example location object { id: 1614967326766, location: { lat: 39.75202, lng: -105.66234 } }

  const ABRes = await getTrueHalfway(A, B);
  const BCRes = await getTrueHalfway(B, C);
  const CARes = await getTrueHalfway(C, A);

  const resObj = await triangulate(ABRes, BCRes, CARes);

  console.log(resObj);

  //const abbccaDM = await fetchMultiDistanceMatrix({ abRes: ABRes, bcRes: BCRes, caRes: CARes });
  //const abbccaDM = await fetchMultiDistanceMatrix({ ABRes, bcRes, caRes });

  // abbccaDM.rows[0].elements[0] always 0
  // abbccaDM.rows[1].elements[1] always 0
  // abbccaDM.rows[2].elements[2] always 0

  // if (abbccaDM.rows[0].elements[1].duration.value > 600 || abbccaDM.rows[0].elements[2].duration.value) {

  // }

  // const abbcRes = await getTrueHalfway(ABRes.location, BCRes.location);
  // const bccaRes = await getTrueHalfway(BCRes.location, CARes.location);
  // const caabRes = await getTrueHalfway(CARes.location, ABRes.location);

  try {
    //res.send({ abRes: ABRes, bcRes: BCRes, caRes: CARes, abbcRes, bccaRes, caabRes, abbccaDM });
    console.log(resObj);
    res.send({ ABRes, BCRes, CARes, resObj });
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
