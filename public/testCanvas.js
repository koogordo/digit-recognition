let data = [];
let finalPrediction;

function setup() {
  let size = 280;
  //pixelDensity(0.05);
  var outputCanvas = createCanvas(size, size);
  outputCanvas.parent('outputTest');
  background(255);
  strokeWeight(15);
  stroke(0);
}

function arrayToCreateImg() {}

$('predict').on('click', arrayToCreateImg);
