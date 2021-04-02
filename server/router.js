'use strict';

const router = require('express').Router();
const controller = require('./controller');

router.get('/getroutes/:A/:B/:mode/:type', controller.getRoute);
router.get('/getrandomcity', controller.getRandomCity);

module.exports = router;
