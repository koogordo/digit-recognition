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
    }

    return await fs.writeFile(
      __dirname + '/../public/trainingData.json',
      JSON.stringify(imagesJsonObject),
      err => {
        if (err) {
          console.log(err);
        }
      }
    );
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
