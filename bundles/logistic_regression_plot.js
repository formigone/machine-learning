import SigmoidClassifier from '../logistic-reg/SigmoidClassifier';
import { genCanvas, drawPoint, calcY, Point } from '../logistic-reg/util';


function sum(x, w) {
  return x.reduce((acc, _x, i) => acc + _x * w[i], 0);
}

function sig(z) {
  return 1 / (1 + Math.exp(-z));
}

function cost(scores, labels) {
  return -(1 / scores.length) * scores.reduce((acc, score, i) => {
      const y = labels[i][0];
      return y * Math.log(score) + (1 - y) * Math.log(1 - score);
    }, 0);
}

function clear(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function render(ctx, points) {
  points.forEach(point => {
    ctx.fillStyle = point.color;
    ctx.fillRect(Math.max(0, point.x - 2), Math.max(0, point.y - 2), 4, 4);
  })
}

function renderEach(ctx, params, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (sig(sum([1, x / 100, y / 100], params)) < 0.5) {
        ctx.fillStyle = '#b22438';
      } else {
        ctx.fillStyle = '#fff9b6';
      }

      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 *
 * @param {Array<Array<number>>} xTrain
 * @param {Array<Array<number>>} yTrain
 * @param {Array<number>} params
 * @param {number} learningRate
 * @param {number} cycle
 * @param {number} maxCycles
 * @param {Array<Point>} points
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {HTMLElement} log
 */
function doEpoch(xTrain, yTrain, params, learningRate, cycle, maxCycles, points, ctx, width, height, log) {
  const scores = xTrain.map(sample => sig(sum(sample, params)));
  const errors = scores.map((score, i) => score - yTrain[i][0]);

  params = params.map((param, col) => {
    return param - learningRate * errors.reduce((acc, error, row) => (acc + error * xTrain[row][col]), 0);
  });

  const J = cost(scores, yTrain);

  if (cycle % 10 === 0) {
    log.textContent = `Epoch = ${cycle}, Cost = ${J}, Learning Rate = ${learningRate}`;
    clear(ctx);
    renderEach(ctx, params, width, height);
    render(ctx, points);
  }

  if (cycle < maxCycles) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        doEpoch(xTrain, yTrain, params, learningRate, cycle + 1, maxCycles, points, ctx, width, height, log);
      }, 0);
    });
  }
}


/**
 *
 * @param {HTMLElement=} container
 */
function main(container) {
  if (!(container instanceof HTMLElement)) {
    container = document.body;
  }

  const btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.style = 'display: block;';
  container.appendChild(btn);

  const canvas = genCanvas(Math.min(window.innerWidth, 600), Math.min(window.innerHeight * 0.3, 300), 'log-reg-canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const line = { yIntercept: canvas.height / 2, slope: Math.random() - 0.25 };

  const points = [];
  const radius = 3;
  const colors = {
    pos: '#3c5cff',
    neg: '#f956ff',
  };

  const log = document.createElement('p');
  container.appendChild(log);

  for (let i = 0; i < 110; i++) {
    let point = new Point(
      Math.max(radius * 2, parseInt(Math.random() * canvas.width, 10) - radius),
      Math.max(radius * 2, parseInt(Math.random() * canvas.height, 10) - radius),
      colors.pos
    );

    if (point.y <= calcY(point.x, line.slope, line.yIntercept)) {
      point.color = colors.neg;
    }

    points.push(point);
  }

  let xTrain = points.map(({ x, y }) => [1, x / 100, y / 100]);
  let yTrain = points.map(({ color }) => [Number(color === colors.pos)]);

  var params = xTrain[0].map(() => Math.random());

  var epochs = 5000;
  var learningRate = 0.01;

  renderEach(ctx, params, canvas.width, canvas.height);
  render(ctx, points);

  btn.addEventListener('click', function () {
    doEpoch(xTrain, yTrain, params, learningRate, 0, epochs, points, ctx, canvas.width, canvas.height, log);
    btn.setAttribute('disabled', 'true');
  });
}

export default main;
