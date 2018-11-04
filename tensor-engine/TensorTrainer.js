class TensorTrainer {
  constructor(trainingData) {
    this.trainingData = trainingData;
    this.trainingData.map(item => {
      tf.tensor2d(item.data, [28, 28]);
    });
  }
}
module.exports = TensorTrainer;
