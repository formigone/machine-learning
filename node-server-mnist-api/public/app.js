function drawCanvas(pixels, width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var px = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var max = Number.MAX_SAFE_INTEGER;
  var min = Number.MIN_SAFE_INTEGER;
console.log(pixels)
  pixels.forEach(function (val) {
    if (val > min) {
      min = val;
    }

    if (val < max) {
      max = val;
    }
  });

  var tmp = max;
  max = min;
  min = tmp;

  pixels = pixels.map(function (val) {
    return 1 - (val - min) / (max - min);
  });

  for (var i = 0, _i = 0; i < pixels.length * 4; i += 4, _i += 1) {
    var val = pixels[_i];
    px.data[i] = px.data[i + 1] = px.data[i + 2] = 255 * val;
    px.data[i + 3] = 255;
  }
  ctx.putImageData(px, 0, 0);

  return canvas;
}

function loadDigit(digits, index) {
  if (index >= digits.length) {
    document.body.removeChild(loader);
    return;
  }

  new Promise((resolve, reject) => {
    var key = digits[index];
    var data = localStorage.getItem(key);
    if (data) {
      resolve(JSON.parse(data));
      return;
    }

    fetch('/digit/' + key)
      .then(res => res.json())
      .then(json => {
        localStorage.setItem(key, JSON.stringify(json.response));
        resolve(json.response);
      });
  })
    .then(digit => {
      container.appendChild(genCard(digit));
      loadDigit(digits, index + 1);
    });
}

function genCard(data) {
  console.log('data', data)
  const canvas = drawCanvas(data.pixels, 28, 28);
  const stats = dfrag('li', { className: 'card-toolbar_col', style: 'flex-grow: 5' }, [
    dfrag('div', { className: 'card-toolbar-bar-graph-shell' }, [
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 25%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 75%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 55%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 85%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 25%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 5%' }),
      dfrag('div', { className: 'card-toolbar-bar-graph', style: 'height: 35%' }),
    ]),
  ]);
  const correct = 'correct' in data ? (data.correct ? 'color_prediction-correct' : 'color_prediction-wrong') : 'color_prediction-unset';
  return dfrag('div', { className: 'card card_inline' }, [
    canvas,
    dfrag('ul', { className: `card-toolbar ${correct}` }, [
      dfrag('li', { className: 'card-toolbar_col' }, [
        dfrag('h3', { className: 'card-toolbar-prediction' }, data.prediction || '--'),
      ]),
    ]),
  ]);
}

var container = dfrag('div', { className: 'container' });
var loader = dfrag('h1', { className: 'snackbar' });
loader.textContent = 'Loading...';
document.body.appendChild(container);
document.body.appendChild(loader);
fetch('/digits')
  .then(res => res.json())
  .then(json => {
    loadDigit(json, 0);
    // document.body.removeChild(loader);
    // json.files.forEach(file => {
    //   document.body.appendChild(render(file.pixels, 28, 28));
    // });
  });
