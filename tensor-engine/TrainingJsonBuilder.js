const fs = require('fs');
class TrainingJsonBuilder {
  constructor() {
    // this.loadDataBuffer();
    // this.loadLabelBuffer();
  }

  loadDataBuffer() {
    return this.createDataFileBufferAsync();
  }

  loadLabelBuffer() {
    return this.createLabelFileBufferAsync();
  }

  async buildTrainingJson(dfb, lfb) {
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
        }
      }
    );
    return await {
      status: 'done',
      success: true,
      message: 'Training Data is Ready to Use'
    };
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
