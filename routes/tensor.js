const express = require('express');
const router = express.Router();
const DigitModel = require('../tensor-engine/DigitModel');
const dm = new DigitModel();
router.get('/train', function(req, res, next) {
  dm.compile()
    .then(() => {
      console.log('compiled');
      dm.load()
        .then(() => {
          console.log('loaded');
          dm.train()
            .then(() => {
              console.log('trained');
              dm.saveModel()
                .then(() => {
                  res.send('model trained and saved');
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

router.post('/predict', function(req, res, next) {
  dm.predict(req.body).then(prediction => {
    res.send(prediction);
  });
});

router.get('/reset', function(req, res, next) {
  const nn = new NeuralNetwork();
  nn.createModel();
  res.send('New model created.');
});

module.exports = router;
