const fs = require('fs');
const TensorTrainer = require('./TensorTrainer');
const TrainingJsonBuilder = require('./TrainingJsonBuilder');
class TensorEngine {
  constructor() {
    this.trainingJsonBuilder = new this.tensorJsonBuilder();
    this.trainingJsonBuilder.buildTrainingJson();
    this.tensorTrainer = new TensorTrainer();
  }
}
module.exports = TensorEngine;
