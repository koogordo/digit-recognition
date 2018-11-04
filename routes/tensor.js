const express = require('express');
const router = express.Router();
const NeuralNetwork = require('../tensor-engine/NeuralNetwork');

router.get('/', function(req, res, next) {
  res.json({ success: true, message: 'You have reached the tensorflow api' });
});

module.exports = router;
