const fs = require('fs');
const TensorTrainer = require('./TensorTrainer');
const TrainingJsonBuilder = require('./TrainingJsonBuilder');
class TensorEngine {
  constructor() {
    // NOTE check if trainingData.json exists
    // if the file doesnt exist than build it using the TrainingJsonBuilder
    // else just go ahead and create the the TensorTrainer object
    if (!fs.existsSync(__dirname + '/../public/trainingData.json')) {
      this.trainingJsonBuilder = new TrainingJsonBuilder();

      // NOTE call the loadDataBuffer method in JsonBuilder to load the mnist data
      this.trainingJsonBuilder
        .loadDataBuffer()
        .then(dfb => {
          // NOTE the data buffer has loaded now we have to loadLabelBuffer which is the mnist labels
          this.trainingJsonBuilder
            .loadLabelBuffer()
            .then(lfb => {
              // NOTE both the fileBuffers of the the mnist data are created now pass them
              // to buildTrainingBuffer to be converted to json and saved
              this.trainingJsonBuilder
                .buildTrainingJson(dfb, lfb)
                .then(status => {
                  // NOTE here we know that the Json has been built so now we can create a new // TensorTrainer
                  if (status) {
                    const trainingData = require('../public/trainingData.json');
                    this.tensorTrainer = new TensorTrainer(trainingData);
                  }
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    } else {
      const trainingData = require('../public/trainingData.json');
      this.tensorTrainer = new TensorTrainer(trainingData);
    }
  }
}
module.exports = TensorEngine;
