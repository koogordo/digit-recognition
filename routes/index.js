var express = require('express');
var router = express.Router();
var TensorEngine = require('../tensor-engine/TensorEngine');
/* GET home page. */
router.get('/', function(req, res, next) {
  let tensorEngine = new TensorEngine();
  var title = 'Welcome to the app';
  res.render('index', { title });
});

module.exports = router;
