var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  res.json({ success: true, message: 'You have reached the tensorflow api' });
});

module.exports = router;
