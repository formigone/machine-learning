var formigone = formigone || {}; formigone["neural_network_plot"] =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
function curveFactory(yIntercept, width) {
  return function (x) {
    return width * x * x + yIntercept;
  };
}

function render(ctx, points) {
  points.forEach(function (point) {
    if (Math.random() > 0.99) {
      ctx.fillStyle = point[2];
      ctx.fillRect(point[0] - 2, point[1] - 2, 4, 4);
    }
  });
}

function renderEach(ctx, width, height) {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
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

  var btn = document.createElement('button');
  btn.textContent = 'Start';
  btn.style = 'display: block;';
  container.appendChild(btn);

  var canvas = document.createElement('canvas');
  canvas.width = Math.min(window.innerWidth, 600);
  canvas.height = Math.min(window.innerHeight * 0.3, 300);
  canvas.classname = 'nn-canvas';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var points = [];
  var colors = {
    pos: '#3c5cff',
    neg: '#f956ff'
  };

  var curve = curveFactory(canvas.height / 4, Math.random() / 500);

  for (var i = 0; i < 15000; i++) {
    var point = [parseInt(Math.random() * canvas.width, 10), parseInt(Math.random() * canvas.height, 10), colors.pos];

    if (point[1] > curve(point[0])) {
      point[2] = colors.neg;
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

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  renderEach(ctx, canvas.width, canvas.height);
  render(ctx, points);

  btn.addEventListener('click', function () {
    btn.setAttribute('disabled', 'true');
  });
}

exports.default = main;

/***/ })

/******/ });