const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'Welcome to the app';
  res.render('index', { title });
});

module.exports = router;
