let data = [];
let finalPrediction;

function setup() {
  let size = 280;
  //pixelDensity(0.05);
  var myCanvas = createCanvas(size, size);
  myCanvas.parent('input');
  background(255);
  strokeWeight(15);
  stroke(0);
}

function touchMoved() {
  line(mouseX, mouseY, pmouseX, pmouseY);
  return false;
}

function savePixels() {
  let img = get(); //makes canvas into p5 img object
  let input = [];
  img.resize(28, 28);
  img.loadPixels();
  console.log(input);
  console.log(img);
  for (let i = 0; i < img.pixels.length; i += 4) {
    let pix = img.pixels[i];
    input[i / 4] = 1 - pix / 255;
  }

  // let compressed_pixels = pixels.map(pix => {
  //   return pix / 255;
  // });

  //console.log(img);
  let payload = JSON.stringify(input);
  let url = 'http://localhost:3000/tensor/predict';
  $.ajax({
    type: 'POST',
    url: url,
    contentType: 'application/json',
    data: payload,
    success: prediction => {
      console.log(prediction[0]);
      finalPrediction = prediction[0];

      myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      myChart.data.datasets[0].data[finalPrediction] = 1;
      myChart.data.datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.2)';
      myChart.data.datasets[0].borderColor = 'rgba(54, 162, 235, 1)';
      myChart.update();
    }
  });
}

$('#predict').click(function() {
  savePixels();
});

$('#clear').click(function() {
  // console.log('clear');
  // clear();
  myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  myChart.data.datasets[0].backgroundColor = 'rgba(255, 99, 132, 0.2)';
  myChart.data.datasets[0].borderColor = 'rgba(255, 99, 132, 1)';
  myChart.update();
  background(255);
});

// =============================================================================
// OUTPUT GRAPH
// =============================================================================

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

// =============================================================================
//   TEXT SCRAMBLE
// =============================================================================

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = ['Digit Recognition'];

const el = document.querySelector('.text');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 800);
  });
  counter = (counter + 1) % phrases.length;
};

next();
