const fs = require('fs');
const TensorTrainer = require('./TensorTrainer');
class TensorEngine {
  constructor() {
    this.tensorTrainer = new TensorTrainer();
  }
}
module.exports = TensorEngine;
