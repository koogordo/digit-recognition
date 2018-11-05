const fs = require('fs');
const rxjs = require('rxjs');
class MnistDataSet {
  constructor() {
    this.BATCH_SIZE = 50176;
    this.LABEL_BATCH_SIZE = 64;
  }
  async toBatchObjects(dfb, lfb) {
    let batchArray = [];
    let mnistBatchedObjects = [];
    for (let i = 1; i < dfb.length; i++) {
      batchArray.push(dfb[i]);
      if (i % this.BATCH_SIZE === 0 && i >= this.BATCH_SIZE) {
        mnistBatchedObjects.push({ xs: batchArray });
        batchArray = [];
      }
    }
    let labelArray = [];
    let labelArrays = [];
    let labelsNormalized = [];
    for (let i = 1; i < lfb.length; i++) {
      labelArray.push(lfb[i]);
      if (i % this.LABEL_BATCH_SIZE === 0 && i >= this.LABEL_BATCH_SIZE) {
        for (let j = 0; j < labelArray.length; j++) {
          labelsNormalized.push([
            labelArray[j] === 0 ? 1 : 0,
            labelArray[j] === 1 ? 1 : 0,
            labelArray[j] === 2 ? 1 : 0,
            labelArray[j] === 3 ? 1 : 0,
            labelArray[j] === 4 ? 1 : 0,
            labelArray[j] === 5 ? 1 : 0,
            labelArray[j] === 6 ? 1 : 0,
            labelArray[j] === 7 ? 1 : 0,
            labelArray[j] === 8 ? 1 : 0,
            labelArray[j] === 9 ? 1 : 0
          ]);
        }
        let flattened = [].concat.apply([], labelsNormalized);
        labelArrays.push(flattened);
        labelArray = [];
        labelsNormalized = [];
      }
    }
    for (let i = 0; i < mnistBatchedObjects.length; i++) {
      mnistBatchedObjects[i].ys = labelArrays[i];
    }
    return await mnistBatchedObjects;
  }

  getDataBatched() {
    return this.batchedData;
  }
  getData1d() {
    return this.data1d;
  }
  getData2d() {
    console.log(this.data2d);
    return this.data2d;
  }
  getLabelsBatched() {
    return this.labelsBatched;
  }
  getLabels1d() {
    return this.labels1d;
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
