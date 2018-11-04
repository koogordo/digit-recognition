const MnistDataSet = require('./MnistDataSet');
class NueralNetwork {
  constructor(trainingData) {
    this.mds = new MnistDataSet();
    this.trainingData = this.mds.data();
  }

  trainingDataInstance() {
    return this.trainingData;
  }
}
module.exports = NueralNetwork;
