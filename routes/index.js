'use strict';

const router = require('express').Router();
const controllers = require('../controllers');

router.use(/\//, controllers.search);
router.get('/applicant/:id', controllers.applicant);

module.exports = router;
