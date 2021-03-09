'use strict';

const router = require('express').Router();
const controller = require('./controller');

router.get('/getroutes/:A/:B/:mode/:type', controller.getRoute);
router.get('/getrandomcity', controller.getRandomCity);

// // router.post("/topics", topicsController.postNewTopic);
// // router.delete("/topics/:id", topicsController.deleteTopic);
// // router.put("/topics/:id/up", topicsController.voteUp);
// // router.put("/topics/:id/down", topicsController.voteDown);

module.exports = router;
