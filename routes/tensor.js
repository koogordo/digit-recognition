const express = require('express');
const router = express.Router();
const NeuralNetwork = require('../tensor-engine/NeuralNetwork');

router.get('/', function(req, res, next) {
  let nn = new NeuralNetwork();
  res.send('Tensor loading');
});

module.exports = router;
