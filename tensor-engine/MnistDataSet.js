const fs = require('fs');
class MnistDataSet {
  constructor() {
    this.loadDataBuffer().then(dfb => {
      this.loadLabelBuffer().then(lfb => {
        this.dataFileBuffer = dfb;
        this.labelFileBuffer = lfb;
      });
    });
  }

  data() {
    let dfb = this.dataFileBuffer;
    let lfb = this.labelFileBuffer;
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
    return imagesJsonObject; //fs.writeFile(
    //   __dirname + '/../public/trainingData.json',
    //   JSON.stringify(imagesJsonObject),
    //   err => {
    //     if (err) {
    //       console.log(err);
    //     }
    //   }
    // );
  }

  loadDataBuffer() {
    return this.createDataFileBufferAsync();
  }

  loadLabelBuffer() {
    return this.createLabelFileBufferAsync();
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
module.exports = MnistDataSet;
