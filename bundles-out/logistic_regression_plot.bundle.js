var formigone = formigone || {}; formigone["logistic_regression_plot"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SigmoidClassifier = __webpack_require__(9);

var _SigmoidClassifier2 = _interopRequireDefault(_SigmoidClassifier);

var _util = __webpack_require__(10);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sum(x, w) {
  return x.reduce(function (acc, _x, i) {
    return acc + _x * w[i];
  }, 0);
}

function sig(z) {
  return 1 / (1 + Math.exp(-z));
}

function cost(scores, labels) {
  return -(1 / scores.length) * scores.reduce(function (acc, score, i) {
    var y = labels[i][0];
    return y * Math.log(score) + (1 - y) * Math.log(1 - score);
  }, 0);
}

function clear(ctx) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function render(ctx, points) {
  points.forEach(function (point) {
    ctx.fillStyle = point.color;
    ctx.fillRect(Math.max(0, point.x - 2), Math.max(0, point.y - 2), 4, 4);
  });
}

function renderEach(ctx, params, width, height) {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      if (sig(sum([1, x / 100, y / 100], params)) < 0.5) {
        ctx.fillStyle = '#FFB5F7';
      } else {
        ctx.fillStyle = '#A5A6FF';
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
  var scores = xTrain.map(function (sample) {
    return sig(sum(sample, params));
  });
  var errors = scores.map(function (score, i) {
    return score - yTrain[i][0];
  });

  params = params.map(function (param, col) {
    return param - learningRate * errors.reduce(function (acc, error, row) {
      return acc + error * xTrain[row][col];
    }, 0);
  });

  var J = cost(scores, yTrain);

  if (cycle % 10 === 0) {
    log.textContent = 'Epoch = ' + cycle + ', Cost = ' + Number(J).toFixed(8) + ', Learning Rate = ' + learningRate;
    clear(ctx);
    renderEach(ctx, params, width, height);
    render(ctx, points);
  }

  if (cycle < maxCycles) {
    requestAnimationFrame(function () {
      setTimeout(function () {
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

  var btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.style = 'display: block;';
  container.appendChild(btn);

  var canvas = (0, _util.genCanvas)(Math.min(window.innerWidth, 600), Math.min(window.innerHeight * 0.3, 300), 'log-reg-canvas');
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var line = { yIntercept: canvas.height / 2, slope: Math.random() - 0.25 };

  var points = [];
  var radius = 3;
  var colors = {
    pos: '#3c5cff',
    neg: '#f956ff'
  };

  var log = document.createElement('p');
  container.appendChild(log);

  for (var i = 0; i < 110; i++) {
    var point = new _util.Point(Math.max(radius * 2, parseInt(Math.random() * canvas.width, 10) - radius), Math.max(radius * 2, parseInt(Math.random() * canvas.height, 10) - radius), colors.pos);

    if (point.y <= (0, _util.calcY)(point.x, line.slope, line.yIntercept)) {
      point.color = colors.neg;
    }

    points.push(point);
  }

  var xTrain = points.map(function (_ref) {
    var x = _ref.x,
        y = _ref.y;
    return [1, x / 100, y / 100];
  });
  var yTrain = points.map(function (_ref2) {
    var color = _ref2.color;
    return [Number(color === colors.pos)];
  });

  var params = xTrain[0].map(function () {
    return Math.random();
  });

  var epochs = 5000;
  var learningRate = 0.01;

  renderEach(ctx, params, canvas.width, canvas.height);
  render(ctx, points);

  btn.addEventListener('click', function () {
    doEpoch(xTrain, yTrain, params, learningRate, 0, epochs, points, ctx, canvas.width, canvas.height, log);
    btn.setAttribute('disabled', 'true');
  });
}

exports.default = main;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mathHelper = __webpack_require__(1);

function SigmoidClassifier(numFeatures) {
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
SigmoidClassifier.prototype.train = function (samples, labels, config) {
  var _this = this;

  var maxEpochs = config.epochs || 10;
  var epoch = 0;
  var maxCost = config.maxCost || 0.05;
  var learningRate = config.learningRate || 0.05;
  var logCost = config.logCost || 100;
  var logCallback = config.logCallback || function () {};
  var M = samples.length;

  var lr = learningRate / M;
  var costFrac = -1 / M;

  while (epoch++ < maxEpochs) {
    var scores = samples.map(function (sample) {
      return _this.score(sample);
    });

    if (logCost > 0 && epoch % logCost === 0) {
      //   var error = scores.reduce(function (acc, score, i) {
      //     const diff = (labels[i][0] * Math.log(score)) + (1 - labels[i][0]) * Math.log(1 - score);
      //     return acc + diff;
      //   }, 0);
      //   var cost = costFrac * error;
      //   if (Number.isNaN(cost)) {
      //     throw new Error('Cost exploded');
      //   }
      //
      //   if (cost < maxCost) {
      //     break;
      //   }
      //
      logCallback({ model: this, cost: 10, epoch: epoch, logCost: logCost });
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
 */
SigmoidClassifier.prototype.score = function (inputs) {
  var _this2 = this;

  if (inputs.length !== this.params.length) {
    throw new Error('Input size mismatch. Your input must have length of ' + this.params.length);
  }

  var sum = inputs.reduce(function (acc, input, i) {
    return acc + input * _this2.params[i];
  }, 0);

  return 1 / (1 + Math.exp(-sum));
};

/**
 *
 * @returm {Array<number>}
 */
SigmoidClassifier.prototype.getParams = function () {
  return this.params;
};

/**
 *
 * @param {Array<number>} params
 */
SigmoidClassifier.prototype.setParams = function (params) {
  if (params.length !== this.params.length) {
    throw new Error('Parameters size mismatch. Your list of parameters must have length of ' + this.params.length);
  }

  this.params = params;
};

exports.default = SigmoidClassifier;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawLine = drawLine;
exports.genCanvas = genCanvas;
exports.calcY = calcY;
exports.drawPoint = drawPoint;
exports.Point = Point;
/**
 *
 * @param slope
 * @param yIntercept
 * @param {HTMLCanvasElement} canvas
 * @param {Object} config
 */
function drawLine(slope, yIntercept, canvas, config) {
  var ctx = canvas.getContext('2d');
  ctx.save();
  Object.keys(config).forEach(function (key) {
    ctx[key] = config[key];
  });

  var y = slope * canvas.width + yIntercept;
  ctx.beginPath();
  ctx.moveTo(0, yIntercept);
  ctx.lineTo(canvas.width, y);
  ctx.stroke();

  ctx.restore();
}

function genCanvas(width, height, className) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.className = className;
  return canvas;
}

/**
 *
 * @param {number} x
 * @param {number} slope
 * @param {number} yIntercept
 * @returns {number}
 */
function calcY(x, slope, yIntercept) {
  return slope * x + yIntercept;
}

/**
 *
 * @param {Point} point
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} config
 */
function drawPoint(point, ctx, config) {
  ctx.save();
  Object.keys(config).forEach(function (key) {
    ctx[key] = config[key];
  });

  ctx.beginPath();
  ctx.arc(point.x, point.y, config.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = point.color;
  ctx.fill();

  ctx.restore();
}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {string} color
 * @constructor
 */
function Point(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
}

/***/ })
/******/ ]);