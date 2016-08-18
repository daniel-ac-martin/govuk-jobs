'use strict';

const router = require('express').Router();
const controllers = require('../controllers');

router.use('/one', (req, res) => {
  res.render('one');
});

router.use('/two', (req, res) => {
  res.render('two');
});

router.use(/\//, controllers.search);
router.get('/applicant/:id', controllers.applicant);

module.exports = router;
