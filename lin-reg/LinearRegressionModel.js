var { genArray } = require('./arrayHelper');

function LinearRegressionModel(numFeatures) {
  // Zeroth input will always be a constant bias unit == 1
  /** @type {Array<number>} params */
  this.params = genArray(numFeatures + 1, () => Math.random());
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
 * @param {Object} config - { learningRate, maxCost, epochs, logCost, logCallback }
 */
LinearRegressionModel.prototype.train = function (samples, labels, config) {
  var maxEpochs = config.epochs || 10;
  var epoch = 0;
  var maxCost = config.maxCost || 0.05;
  var learningRate = config.learningRate || 0.05;
  var logCost = config.logCost || 100;
  var logCallback = config.logCallback || function(){};
  var M = samples.length;

  // Add zeroth bias input
  samples = samples.map(sample => [1].concat(sample));

  while(epoch++ < maxEpochs) {
    var scores = samples.map(sample => this.score(sample, true));
    var errorSquared = scores.reduce((acc, score, i) => {
      var diff = score - labels[i][0];
      return acc + diff * diff;
    }, 0);
    var cost = 1 / (2 * M) * errorSquared;
    if (Number.isNaN(cost)) {
      throw new Error('Cost exploded');
    }

    if (cost < maxCost) {
      break;
    }

    if (logCost > 0 && epoch % logCost === 0) {
      logCallback({ model: this, cost, epoch });
    }

    var errors = scores.map((score, i) => score - labels[i][0]);
    this.params = this.params.map((param, col) => {
      return param - learningRate * errors.reduce((acc, error, row) => {
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
    throw new Error(`Input size mismatch. Your input must have length of ${this.params.length}`);
  }

  return inputs.reduce((acc, input, i) => {
    return acc + input * this.params[i];
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
    throw new Error(`Parameters size mismatch. Your list of parameters must have length of ${this.params.length}`);
  }

  this.params = params;
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LinearRegressionModel;
}
