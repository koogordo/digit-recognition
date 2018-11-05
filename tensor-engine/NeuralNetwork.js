const MnistDataSet = require('./MnistDataSet');
const tf = require('@tensorflow/tfjs');
class NeuralNetwork {
  constructor() {
    this.mds = new MnistDataSet();
    this.mds
      .loadDataBuffer()
      .then(dfb => {
        this.mds
          .loadLabelBuffer()
          .then(lfb => {
            this.mds
              .toBatchObjects(dfb, lfb)
              .then(batchObjs => {
                this.batchObjects = batchObjs;
                this.createModel(this.batchObjects);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  createModel(batchObjects) {
    //create a sequential model where layers can be stacked
    let model;
    model = tf.sequential();
    const LEARNING_RATE = 0.15;

    //takes in config objects
    model.add(
      tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5, //The size of the sliding convolutional filter windows to be applied to the input data. 5x5 pixels
        filters: 8, //nThe number of filter windows to apply to the input data
        strides: 1, //how many pixels the filter will shift each time it moves over the image.
        activation: 'relu',
        kernelInitializer: 'VarianceScaling' //The method to use for randomly initializing the model weights, which is very important to training dynamics
      })
    );
    //max pooling downsamples it
    model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2], //The size of the sliding pooling windows to be applied to the input data.
        strides: [2, 2] //means that the pooling layer will apply 2x2 windows to the input data.
      })
    );

    //we repeat the 2 layers increasing the filters from 8 to 16
    model.add(
      tf.layers.conv2d({
        //input shape 'inherited' from last conv2d layer
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
      })
    );

    model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
      })
    );

    //Next, let's add a flatten layer to flatten the output of the previous layer to a vector
    model.add(tf.layers.flatten());

    //add a dense layer (also known as a fully connected layer), which will perform the final classification.
    model.add(
      tf.layers.dense({
        units: 10,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax' //create probability distribution for all output options
      })
    );

    console.log('Model Created :)');

    /*
    categoricalCrossentropy:
    measures the error between the probability distribution generated by the last layer 
    of our model and the probability distribution given by our label, 
    which will be a distribution with 1 (100%) in the correct class label.
    */
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE), //
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
    // this.train(model, batchObjects);
  }

  train(model, batchObjects) {
    let start = Date.now();
    for (let i = 0; i < batchObjects.length; i++) {
      this.fitAsync(model, batchObjects[i].xs, batchObjects[i].ys).then(
        history => {}
      );
    }
    let duration = Date.now() - start;
    // console.log(loss);
    console.log(`It took: ${duration}`);
  }
  async fitAsync(model, xs, ys) {
    let inputs = tf.tensor4d(xs, [64, 28, 28, 1]);
    let outputs = tf.tensor2d(ys, [64, 10]);
    let modelHistory = model
      .fit(inputs, outputs, {
        epochs: 50
      })
      .then(history => {
        return history;
      })
      .catch(err => console.log(err));
    return await modelHistory;
  }
}

module.exports = NeuralNetwork;