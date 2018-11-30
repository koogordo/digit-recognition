const MnistData = require('./data');
const tf = require('@tensorflow/tfjs');
class DigitModel {
  constructor() {
    this.IMAGE_H = 28;
    this.IMAGE_W = 28;
    this.IMAGE_SIZE = this.IMAGE_H * this.IMAGE_W;
    this.model = tf.sequential();
    //takes in config objects
    this.model.add(
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
    this.model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2], //The size of the sliding pooling windows to be applied to the input data.
        strides: [2, 2] //means that the pooling layer will apply 2x2 windows to the input data.
      })
    );
    //we repeat the 2 layers increasing the filters from 8 to 16
    this.model.add(
      tf.layers.conv2d({
        //input shape 'inherited' from last conv2d layer
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
      })
    );
    this.model.add(
      tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
      })
    );

    //Next, let's add a flatten layer to flatten the output of the previous layer to a vector
    this.model.add(tf.layers.flatten());

    //add a dense layer (also known as a fully connected layer), which will perform the final classification.
    this.model.add(
      tf.layers.dense({
        units: 10,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax' //create probability distribution for all output options
      })
    );
  }

  async compile() {
    const LEARNING_RATE = 0.15;
    await this.model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE), //
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async load() {
    console.log('DigitModel is telling data to load up...');
    this.data = new MnistData();
    await this.data.load();
    console.log('data is done loading');
  }

  async train() {
    const BATCH_SIZE = 64;
    const TRAIN_BATCHES = 150;
    console.log('right before for loop');
    for (let i = 0; i < TRAIN_BATCHES; i++) {
      const batch = tf.tidy(() => {
        const batch = this.data.nextTrainBatch(BATCH_SIZE);
        batch.xs = batch.xs.reshape([BATCH_SIZE, 28, 28, 1]);
        return batch;
      });
      console.log('right before fit');
      await this.model.fit(batch.xs, batch.labels, {
        batchSize: BATCH_SIZE,
        epochs: 1
      });
      tf.dispose(batch);
      await tf.nextFrame();
    }
    //await this.saveModel();
  }

  async predict(inputImg = null) {
    if (inputImg) {
      this.loadModel().then(() => {
        console.log('model loaded');
        const xs = tf.tensor2d(inputImg, [1, this.IMAGE_SIZE]);
        tf.tidy(() => {
          const output = this.model.predict(xs.reshape([-1, 28, 28, 1]));
          const prediction_value = Array.from(output.argMax(1).dataSync());
          console.log(prediction_value);
        });
      });
    } else {
      const batch = this.data.nextTestBatch(1);
      console.log(batch.labels.print());
      tf.tidy(() => {
        Array.from(batch.labels.argMax(1).dataSync());
        const output = this.model.predict(batch.xs.reshape([-1, 28, 28, 1]));
        const prediction_value = Array.from(output.argMax(1).dataSync());
        console.log(prediction_value);
      });
    }
  }

  async saveModel() {
    await this.model.save(`file://${__dirname}/../public/digit-recog-model`);
    return await 'Model has been saved.';
  }

  async loadModel() {
    await tf.loadModel(
      `file://${__dirname}/../public/digit-recog-model/model.json`
    );
    return await 'Model has been saved.';
  }
}
module.exports = DigitModel;
