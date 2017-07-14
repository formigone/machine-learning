import { genArray } from '../lin-reg/mathHelper';

function SigmoidClassifier(numFeatures) {
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
 * @param {Object=} config - { learningRate, maxCost, epochs, logCost, logCallback }
 */
SigmoidClassifier.prototype.train = function (samples, labels, config) {
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
    const scores = samples.map(sample => this.score(sample));

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
      logCallback({ model: this, cost: 10, epoch, logCost });
    }

    var errors = scores.map((score, i) => score - labels[i][0]);
    this.params = this.params.map((param, col) => {
      return param - lr * errors.reduce((acc, error, row) => (acc + error * samples[row][col]), 0);
    });
  }
};

/**
 *
 * @param {Array<number>} inputs
 */
SigmoidClassifier.prototype.score = function (inputs) {
  if (inputs.length !== this.params.length) {
    throw new Error(`Input size mismatch. Your input must have length of ${this.params.length}`);
  }

  const sum = inputs.reduce((acc, input, i) => {
    return acc + input * this.params[i];
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
    throw new Error(`Parameters size mismatch. Your list of parameters must have length of ${this.params.length}`);
  }

  this.params = params;
};

export default SigmoidClassifier;
