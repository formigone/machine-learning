var formigone = formigone || {}; formigone["linear_regression_painting"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genArray = genArray;
exports.intToRgb = intToRgb;
exports.rgbToInt = rgbToInt;
exports.ptToVec = ptToVec;
exports.ptVecToPt = ptVecToPt;
exports.iToPt = iToPt;
function genArray(size, value) {
  var arr = [];
  for (var i = 0; i < size; i++) {
    if (value instanceof Function) {
      arr.push(value(arr, i));
    } else {
      arr.push(value);
    }
  }

  return arr;
}

/**
 *
 * @param {number} rgb
 */
function intToRgb(rgb) {
  rgb = parseInt(rgb, 10);
  return 'rgb(' + (rgb >> 16 & 0xFF) + ',' + (rgb >> 8 & 0xFF) + ',' + (rgb & 0xFF) + ')';
}

/**
 *
 * @param {number} r Integer, base 10 (0-255)
 * @param {number} g Integer, base 10 (0-255)
 * @param {number} b Integer, base 10 (0-255)
 */
function rgbToInt(r, g, b) {
  return parseInt(String('0' + Number(r).toString(16)).slice(-2) + String('0' + Number(g).toString(16)).slice(-2) + String('0' + Number(b).toString(16)).slice(-2), 16);
}

/**
 * Given some <x, y> point, create a vector length (width * height) with all zeroes and a one at coordinate <x, y>
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @returns {Array<number>}
 */
function ptToVec(x, y, width, height) {
  var vec = genArray(width * height, 0);
  var i = y * width + x;
  vec[i] = 1;
  return vec;
}

/**
 * Given a point vector representing a grid some width, find the element representing the active point, and return its <x,y> coordinate
 * @param {Array<number>} vec
 * @param {number} width
 * @returns {Array<number>}
 */
function ptVecToPt(vec, width) {
  var pt = 0;
  vec.some(function (val, i) {
    pt = i;
    return val > 0;
  });

  return [pt % width, parseInt(pt / width, 10)];
}

/**
 * @param {number} i
 * @param {number} width
 * @returns {Array<number>}
 */
function iToPt(i, width) {
  return [i % width, parseInt(i / width, 10)];
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LinearRegressionModel = __webpack_require__(2);

var _LinearRegressionModel2 = _interopRequireDefault(_LinearRegressionModel);

var _mathHelper = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    logCallback: function logCallback(data) {
      if (!bundle.epoch) {
        bundle.epoch = 0;
        bundle.costs = [];
      }

      bundle.epoch += 50;
      bundle.costs.push([bundle.epoch, data.cost]);
      bundle.logEl.textContent = 'Epoch: ' + bundle.epoch + ', Cost: ' + data.cost + ', Learning Rate: ' + learningRate;

      xTrain.forEach(function (ptVec) {
        var pt = (0, _mathHelper.ptVecToPt)(ptVec, canvas.width);
        var pred = model.score((0, _mathHelper.ptToVec)(pt[0], pt[1], width, height));
        ctx.fillStyle = (0, _mathHelper.intToRgb)(pred);
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
    }
  });

  if (bundle.running && bundle.costs[bundle.costs.length - 1][1] > maxCost) {
    setTimeout(function () {
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
  if (!(container instanceof HTMLElement)) {
    container = document.body;
  }

  var bundle = { running: true, container: container };
  var btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.setAttribute('disabled', 'true');
  btn.style = 'display: block;';
  container.appendChild(btn);

  var img = new Image();
  img.addEventListener('load', function (e) {
    var canvasOriginal = genCanvas(this.width, this.height, 'lin-reg-canvas');
    var ctxOriginal = canvasOriginal.getContext('2d');
    ctxOriginal.drawImage(this, 0, 0);
    var imgData = ctxOriginal.getImageData(0, 0, canvasOriginal.width, canvasOriginal.height);
    //      ctxOriginal.fillRect(0, 0, this.width, this.height);
    container.appendChild(canvasOriginal);

    var canvas = genCanvas(this.width, this.height, 'lin-reg-canvas');
    var ctx = canvas.getContext('2d');

    var model = new _LinearRegressionModel2.default(this.width * this.height);
    var xTrain = [];
    var yTrain = [];

    for (var y = 0, i = 0, pixels = imgData.data; y < imgData.height; y++) {
      for (var x = 0; x < imgData.width; x++) {
        i = y * 4 * imgData.width + x * 4;
        xTrain.push((0, _mathHelper.ptToVec)(x, y, this.width, this.height));
        yTrain.push([(0, _mathHelper.rgbToInt)(pixels[i], pixels[i + 1], pixels[i + 2])]);
      }
    }

    container.appendChild(canvas);
    btn.removeAttribute('disabled');
    btn.addEventListener('click', function () {
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
  google.charts.setOnLoadCallback(function () {
    chartsReady = true;
  });
}

exports.default = main;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mathHelper = __webpack_require__(0);

function LinearRegressionModel(numFeatures) {
  // Zeroth input will always be a constant bias unit == 1
  /** @type {Array<number>} params */
  this.params = (0, _mathHelper.genArray)(numFeatures + 1, function () {
    return Math.random();
  });
}

// Cost function:
// J(t) = (1 / (2 * M) * SUM(1..M, h(x[i]) - y[i])^2

// Gradient descent:
// t(j) := t(j) - a *  (1 / M) * SUM(1..M, (h(x[i]) - y[i]) * x[i]

// Variables:
// t = theta
// a = alpha (learning rate)
// M = total samples
// h(t) = hypothesis

/**
 *
 * @param {Array<Array<number>>} samples List of samples
 * @param {Array<Array<number>>} labels List of vectors
 * @param {Object=} config - { learningRate, maxCost, epochs, logCost, logCallback }
 */
LinearRegressionModel.prototype.train = function (samples, labels, config) {
  var _this = this;

  var maxEpochs = config.epochs || 10;
  var epoch = 0;
  var maxCost = config.maxCost || 0.05;
  var learningRate = config.learningRate || 0.05;
  var logCost = config.logCost || 100;
  var logCallback = config.logCallback || function () {};
  var M = samples.length;

  var lr = learningRate / M;
  var costFrac = 1 / (2 * M);

  // Add zeroth bias input
  samples = samples.map(function (sample) {
    return [1].concat(sample);
  });

  while (epoch++ < maxEpochs) {
    var scores = samples.map(function (sample) {
      return _this.score(sample, true);
    });

    if (logCost > 0 && epoch % logCost === 1) {
      var errorSquared = scores.reduce(function (acc, score, i) {
        var diff = score - labels[i][0];
        return acc + diff * diff;
      }, 0);
      var cost = costFrac * errorSquared;
      if (Number.isNaN(cost)) {
        throw new Error('Cost exploded');
      }

      if (cost < maxCost) {
        break;
      }

      logCallback({ model: this, cost: cost, epoch: epoch });
    }

    var errors = scores.map(function (score, i) {
      return score - labels[i][0];
    });
    this.params = this.params.map(function (param, col) {
      return param - lr * errors.reduce(function (acc, error, row) {
        return acc + error * samples[row][col];
      }, 0);
    });
  }
};

/**
 *
 * @param {Array<number>} inputs
 * @param {boolean=} includeBias
 */
LinearRegressionModel.prototype.score = function (inputs, includeBias) {
  if (!includeBias) {
    inputs = [1].concat(inputs);
  }

  if (inputs.length !== this.params.length) {
    throw new Error('Input size mismatch. Your input must have length of ' + this.params.length);
  }

  var params = this.params;
  return inputs.reduce(function (acc, input, i) {
    return acc + input * params[i];
  }, 0);
};

/**
 *
 * @returm {Array<number>}
 */
LinearRegressionModel.prototype.getParams = function () {
  return this.params;
};

/**
 *
 * @param {Array<number>} params
 */
LinearRegressionModel.prototype.setParams = function (params) {
  if (params.length !== this.params.length) {
    throw new Error('Parameters size mismatch. Your list of parameters must have length of ' + this.params.length);
  }

  this.params = params;
};

exports.default = LinearRegressionModel;

/***/ })
/******/ ]);