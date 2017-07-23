import synaptic from 'synaptic';

function curveFactory(yIntercept, width) {
  return (x) => width * x * x + yIntercept;
}

function render(ctx, points) {
  points.forEach((point, i) => {
    ctx.fillStyle = point[2];
    ctx.fillRect(point[0] - 2, point[1] - 2, 4, 4);
  });
}

function renderEach(canvas, ctx, width, height, net) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let pred = net.activate([x / canvas.width, y / canvas.height])[0];
      if (pred <= 0.5) {
        ctx.fillStyle = '#FFB5F7';
      } else {
        ctx.fillStyle = '#A5A6FF';
      }

      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function dist(a, b) {
  const x = a[0] - b[0];
  const y = a[1] - b[1];

  return Math.sqrt(x * x + y * y);
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

  const canvas = document.createElement('canvas');
  canvas.width = Math.min(window.innerWidth, 600);
  canvas.height = Math.min(window.innerHeight * 0.3, 300);
  canvas.classname = 'nn-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const points = [];
  const colors = {
    pos: '#3c5cff',
    neg: '#f956ff',
  };

  const circle1 = [canvas.width / 2, canvas.height / 5 * 3, canvas.height / 1.5];
  const circle2 = [canvas.width / 3, canvas.height / 5, canvas.height / 2.5];

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let point = [x, y, colors.pos];

      if (dist(point, circle1) < circle1[2] && dist(point, circle2) > circle2[2]) {
        point[2] = colors.neg;
      }

      points.push(point);
    }
  }

  let xTrain = points.map(([x, y]) => [x / canvas.width, y / canvas.height]);
  let yTrain = points.map(([x, y, color]) => [Number(color === colors.pos)]);
  let trainingSet = xTrain.map((input, i) => (Math.random() > 0.9 ? { input, output: yTrain[i] } : null)).filter(_ => _);
  let samplePoints = points.map((point) => Math.random() > 0.999 ? point : null).filter(_ => _);

  const net = new synaptic.Architect.Perceptron(2, 8, 8, 8, 8, 1);
  const trainer = new synaptic.Trainer(net);

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  renderEach(canvas, ctx, canvas.width, canvas.height, net);
  render(ctx, samplePoints);

  function train(i, max) {
    trainer.trainAsync(trainingSet, {
      rate: 0.0003,
      iterations: 100,
    }).then((res) => {
      console.log(`Error: ${res.error}`)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      renderEach(canvas, ctx, canvas.width, canvas.height, net);
      render(ctx, samplePoints);

      if (i < max) {
        setTimeout(() => {
          train(i + 1, max);
        }, 10);
      }
    });
  }

  train(0, 10000);
  btn.addEventListener('click', function () {
    btn.setAttribute('disabled', 'true');
  });
}

export default main;
