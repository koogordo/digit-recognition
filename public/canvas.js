let data = [];

function setup() {
  let size = 280;
  pixelDensity(0.05);
  var myCanvas = createCanvas(size, size);
  myCanvas.parent('input');
  background(255);
  strokeWeight(20);
  stroke(0);
}

function touchMoved() {
  line(mouseX, mouseY, pmouseX, pmouseY);
  return false;
}

function savePixels() {
  loadPixels();
  let compressed_pixels = pixels.map(pix => {
    return pix / 255;
  });

  console.log(compressed_pixels.length);
  console.table(compressed_pixels);
  let rawPayload = { data: compressed_pixels };
  let payload = JSON.stringify(rawPayload);
  let url = 'http://localhost:3000/tensor/predict';
  $.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/json',
    data: payload,
    success: console.log('success')
  });
}

$('#predict').click(function() {
  savePixels();
});