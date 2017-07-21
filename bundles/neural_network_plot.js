function curveFactory(yIntercept, width) {
  return (x) => width * x * x + yIntercept;
}

function render(ctx, points) {
  points.forEach(point => {
    if (Math.random() > 0.99) {
      ctx.fillStyle = point[2];
      ctx.fillRect(point[0] - 2, point[1] - 2, 4, 4);
    }
  })
}

function renderEach(ctx, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y > x / 2) {
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

  const curve = curveFactory(canvas.height / 4, Math.random() / 500);

  for (let i = 0; i < 15000; i++) {
    let point = [
      parseInt(Math.random() * canvas.width, 10),
      parseInt(Math.random() * canvas.height, 10),
      colors.pos,
    ];

    if (point[1] > curve(point[0])) {
      point[2] = colors.neg;
    }

    points.push(point);
  }

  let xTrain = points.map(({ x, y }) => [1, x / 100, y / 100]);
  let yTrain = points.map(({ color }) => [Number(color === colors.pos)]);

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  renderEach(ctx, canvas.width, canvas.height);
  render(ctx, points);

  btn.addEventListener('click', function () {
    btn.setAttribute('disabled', 'true');
  });
}

export default main;
