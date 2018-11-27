const express = require('express');
const router = express.Router();
const NeuralNetwork = require('../tensor-engine/NeuralNetwork');
const DigitModel = require('../tensor-engine/DigitModel');
const dm = new DigitModel();
router.get('/train', function(req, res, next) {
  res.send('Tensor loading');
});

router.post('/predict', function(req, res, next) {
  if (req.body) {
    dm.load().then(() => {
      dm.predict(req.body.data).then(ouput => {
        res.send(output);
      });
    });
  }
});

router.get('/reset', function(req, res, next) {
  const nn = new NeuralNetwork();
  nn.createModel();
  res.send('New model created.');
});

module.exports = router;
