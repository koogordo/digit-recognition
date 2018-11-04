const fs = require('fs');
const TensorTrainer = require('./TensorTrainer');
const TrainingJsonBuilder = require('./TrainingJsonBuilder');
class TensorEngine {
  constructor() {
    if (!fs.existsSync(__dirname + '/../public/trainingData.json')) {
      this.trainingJsonBuilder = new TrainingJsonBuilder();
      this.trainingJsonBuilder.loadDataBuffer().then(dfb => {
        console.log('loading data buffer');
        this.trainingJsonBuilder.loadLabelBuffer().then(lfb => {
          console.log('loading label buffer');
          this.trainingJsonBuilder.buildTrainingJson(dfb, lfb).then(msg => {
            console.log(msg.message);
            this.tensorTrainer = new TensorTrainer();
          });
        });
      });
    } else {
      this.tensorTrainer = new TensorTrainer();
    }
  }
}
module.exports = TensorEngine;
