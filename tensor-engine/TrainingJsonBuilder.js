const fs = require('fs');
class TrainingJsonBuilder {
  constructor() {
    this.loadDataBuffer();
    this.loadLabelBuffer();
  }

  loadDataBuffer() {
    this.createDataFileBufferAsync().then(dfb => {
      this.dataFileBuffer = dfb;
    });
  }

  loadLabelBuffer() {
    this.createLabelFileBufferAsync().then(lfb => {
      this.labelFileBuffer = lfb;
    });
  }

  buildTrainingJson(dfb, lfb) {
    if (!fs.existsSync(__dirname + '/../../trainingData.json')) {
      let imagesAsPixels = [];
      let imagesJsonObject = [];
      let pixels = [];
      for (let i = 1; i < dfb.length; i++) {
        pixels.push(dfb[i]);
        if (i % 784 === 0) {
          imagesAsPixels.push(pixels);
          pixels = [];
        }
      }
      for (let i = 0; i < imagesAsPixels.length; i++) {
        imagesJsonObject.push({
          label: lfb[i],
          data: imagesAsPixels[i]
        });
        if (i % 5000 === 0) {
          console.log(`Reached image ${i}`);
        }
      }
      // NOTE We should check filesystem to see if file exixts if it doesn't then write
      // or if it does then just return the json.

      fs.writeFile(
        __dirname + '/../../trainingData.json',
        JSON.stringify(imagesJsonObject),
        err => {
          if (err) {
            console.log(err);
          } else {
            console.log('Traning data successfully written...');
          }
        }
      );
      return { success: true, message: 'Created new training json...' };
    } else {
      return {
        success: true,
        message: 'Using the training data that already exists.'
      };
    }
  }

  async createDataFileBufferAsync() {
    let dfb = fs.readFileSync(__dirname + '/../public/train-images-idx3-ubyte');
    return await dfb;
  }
  async createLabelFileBufferAsync() {
    let lfb = fs.readFileSync(__dirname + '/../public/train-labels-idx1-ubyte');
    return await lfb;
  }
}
module.exports = TrainingJsonBuilder;
