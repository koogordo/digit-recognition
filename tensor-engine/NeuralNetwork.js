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
                //this.createModel(this.batchObjects);
                this.createModel().then(() => {
                  (async () => {
                    for (let i = 0; i < 20; i++) {
                      console.log(`Starting epoch ${i + 1}...`);
                      await this.train();
                      console.log(`Finishing epoch ${i + 1}...`);
                    }
                    this.model.save(
                      `file:///${__dirname}/../public/digit-recog-model`
                    );
                  })();
                });
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  async createModel() {
    //create a sequential model where layers can be stacked
    this.model = tf.sequential();
    const LEARNING_RATE = 0.1;
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

    console.log('Model Created :)');

    /*
    categoricalCrossentropy:
    measures the error between the probability distribution generated by the last layer 
    of our model and the probability distribution given by our label, 
    which will be a distribution with 1 (100%) in the correct class label.
    */
    await this.model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE), //
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });
  }

  async train() {
    let shuffledBatches = this.shuffle(this.batchObjects);
    let inputs = [];
    let outputs = [];
    console.log('Creating inputs...');
    for (let i = 0; i < shuffledBatches.length; i++) {
      let xs = tf.tensor4d(shuffledBatches[i].xs, [64, 28, 28, 1]);
      inputs.push(xs);
      let ys = tf.tensor2d(shuffledBatches[i].ys, [64, 10]);
      outputs.push(ys);
    }
    console.log('Inputs done being created...');

    let start = Date.now();
    for (let i = 0; i < inputs.length; i++) {
      await this.model
        .fit(inputs[i], outputs[i], {
          epochs: 3,
          batchSize: 64
        })
        .then(history => history)
        .catch(err => console.log(err));
    }
    console.log(`First round of training took: ${start - Date.now() / 1000}ms`);
  }

  shuffle(batches) {
    console.log('Shuffling beginning...');
    let counter = batches.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = batches[counter];
      batches[counter] = batches[index];
      batches[index] = temp;
    }
    return batches;
  }
}

module.exports = NeuralNetwork;
