const express = require('express');
const router = express.Router();
const NeuralNetwork = require('../tensor-engine/NeuralNetwork');
const DigitModel = require('../tensor-engine/DigitModel');
router.get('/train', function(req, res, next) {
  // const nn = new NeuralNetwork();
  // nn.beginTraining().then(() => {
  //   console.log('Training Done!');
  // });
  const dm = new DigitModel();
  dm.compile().then(() => {
    console.log('Compiled');
    dm.load().then(() => {
      console.log('we are done loading');
      dm.train().then(() => {
        dm.predict().then(() => {
          console.log('predicted');
        });
      });
    });
  });

  res.send('Tensor loading');
});

router.get('/predict', function(req, res, next) {
  const nn = new NeuralNetwork();
  nn.predict();
  res.send('Tensor predicting');
});

router.get('/reset', function(req, res, next) {
  const nn = new NeuralNetwork();
  nn.createModel();
  res.send('New model created.');
});

module.exports = router;
