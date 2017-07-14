import LinearRegressionModel from '../lin-reg/LinearRegressionModel';
import { ptToVec, rgbToInt, ptVecToPt, intToRgb } from '../lin-reg/mathHelper';

var chartsReady = false;
function genCanvas(width, height, className) {
  var canvas = document.createElement('canvas');
  canvas.className = className;
  if (width > 0) {
    canvas.width = width;
  }

  if (height > 0) {
    canvas.height = height;
  }

  return canvas;
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {LinearRegressionModel} model
 * @param {Array<Array<number>>} xTrain
 * @param {Array<Array<number>>} yTrain
 * @param {Object=} bundle
 */
function draw(canvas, ctx, model, xTrain, yTrain, bundle) {
  if (!bundle.logEl) {
    bundle.logEl = document.createElement('p');
    bundle.container.appendChild(bundle.logEl);
  }

  var width = canvas.width;
  var height = canvas.height;
  var maxCost = 0.000001;
  var learningRate = 0.5;

  model.train(xTrain, yTrain, {
    maxCost: maxCost,
    learningRate: learningRate,
    epochs: 5,
    logCost: 0,
    logCallback: function(data) {
      if (!bundle.epoch) {
        bundle.epoch = 0;
        bundle.costs = [];
      }

      bundle.epoch += 50;
      bundle.costs.push([bundle.epoch, data.cost]);
      bundle.logEl.textContent = 'Epoch: ' + bundle.epoch + ', Cost: ' + data.cost + ', Learning Rate: ' + learningRate;

      xTrain.forEach(function(ptVec) {
        var pt = ptVecToPt(ptVec, canvas.width);
        var pred = model.score(ptToVec(pt[0], pt[1], width, height));
        ctx.fillStyle = intToRgb(pred);
        ctx.fillRect(pt[0], pt[1], 1, 1);
      });

      if (chartsReady) {
        if (!bundle.costsTable) {
          bundle.costs.unshift(['Epoch', 'Cost']);
          bundle.costsTable = google.visualization.arrayToDataTable(bundle.costs);

          bundle.chartContainer = document.createElement('div');
          bundle.container.appendChild(bundle.chartContainer);
          bundle.chart = new google.visualization.LineChart(bundle.chartContainer);
        } else {
          bundle.costsTable.addRows([[bundle.epoch, data.cost]]);
        }

        if (bundle.epoch % 1000 === 0) {
          bundle.costs = [['Epoch', 'Cost']].concat(bundle.costs.slice(-10));
          bundle.costsTable = google.visualization.arrayToDataTable(bundle.costs);
          bundle.chart = new google.visualization.LineChart(bundle.chartContainer);
        }

        bundle.chart.draw(bundle.costsTable, { curveType: 'function' });
      }
    },
  });

  if (bundle.running && bundle.costs[bundle.costs.length - 1][1] > maxCost) {
    setTimeout(function(){
      draw(canvas, ctx, model, xTrain, yTrain, bundle);
    }, 10);
  } else {
    console.log('Done');
  }
}



// -----------------------
// -----------------------


/**
 *
 * @param {string} imgUrl
 * @param {HTMLElement=} container
 */
function main(imgUrl, container) {
  if (! (container instanceof HTMLElement)) {
    container = document.body;
  }

  var bundle = { running: true, container };
  var btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.setAttribute('disabled', 'true');
  btn.style = 'display: block;';
  container.appendChild(btn);

  var img = new Image();
  img.addEventListener('load', function(e){
    var canvasOriginal = genCanvas(this.width, this.height, 'lin-reg-canvas');
    var ctxOriginal = canvasOriginal.getContext('2d');
    ctxOriginal.drawImage(this, 0, 0);
    var imgData = ctxOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
//      ctxOriginal.fillRect(0, 0, this.width, this.height);
    container.appendChild(canvasOriginal);

    var canvas = genCanvas(this.width, this.height, 'lin-reg-canvas');
    var ctx = canvas.getContext('2d');

    var model = new LinearRegressionModel(this.width * this.height);
    var xTrain = [];
    var yTrain = [];

    for (var y = 0, i = 0, pixels = imgData.data; y < imgData.height; y++) {
      for (var x = 0; x < imgData.width; x++) {
        i = y * 4 * imgData.width + x * 4;
        xTrain.push(ptToVec(x, y, this.width, this.height));
        yTrain.push([rgbToInt(pixels[i], pixels[i + 1], pixels[i + 2])]);
      }
    }

    container.appendChild(canvas);
    btn.removeAttribute('disabled');
    btn.addEventListener('click', function(){
      if (btn.textContent === 'Start') {
        draw(canvas, ctx, model, xTrain, yTrain, bundle);
        btn.textContent = 'Pause';
      } else if (btn.textContent === 'Pause') {
        bundle.running = false;
        btn.textContent = 'Continue';
      } else if (btn.textContent === 'Continue') {
        bundle.running = true;
        btn.textContent = 'Pause';
        draw(canvas, ctx, model, xTrain, yTrain, bundle);
      }
    });
  });

  img.src = imgUrl;

  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(function(){
    chartsReady = true;
  });
}

export default main;
