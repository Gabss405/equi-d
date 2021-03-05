'use strict';

const { fetchMultiDistanceMatrix } = require('./services');

const getTrueHalfway = require('./utilities/utilities.halfway');
//import getTrueHalfway from './utilities/halfway';
// const halfway = require('./utilities/utilities.halfway');
//TODO : when triangulate compare route from first halfpoint to point in front
//TODO : compare total duration travelled by all parties to other solutions
//TODO : refactor function in utils so it calculates this from route[0].legs[0].duration.value:

exports.calcCentroid = async (req, res) => {
  //console.log(req.params);
  const A = req.params.A;
  const B = req.params.B;
  const C = req.params.C;

  // getTrueHalfway(A,B);
  // console.log(A, B, C);
  const abRes = await getTrueHalfway(A, B);
  const bcRes = await getTrueHalfway(B, C);
  const caRes = await getTrueHalfway(C, A);

  const abbccaDM = await fetchMultiDistanceMatrix({ abRes, bcRes, caRes });

  // abbccaDM.rows[0].elements[0] always 0
  // abbccaDM.rows[1].elements[1] always 0
  // abbccaDM.rows[2].elements[2] always 0

  // if (abbccaDM.rows[0].elements[1].duration.value > 600 || abbccaDM.rows[0].elements[2].duration.value) {

  // }

  const abbcRes = await getTrueHalfway(abRes.location, bcRes.location);
  const bccaRes = await getTrueHalfway(bcRes.location, caRes.location);
  const caabRes = await getTrueHalfway(caRes.location, abRes.location);

  try {
    res.send({ abRes, bcRes, caRes, abbcRes, bccaRes, caabRes, abbccaDM });
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
