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
 * @param {number} learningRate
 * @param {number} maxEpochs
 */
LinearRegressionModel.prototype.train = function (samples, labels, learningRate, maxEpochs) {
  maxEpochs = maxEpochs || 10;

  while(maxEpochs--) {
    var scores = samples.map(sample => this.score(sample));
    var M = samples.length;
    var alpha = learningRate * (1 / M);
    var cost = 1 / (2 * M) * scores.reduce((acc, score, i) => {
        var diff = score - labels[i][0];
        return acc + diff * diff;
      }, 0);

    console.log('cost', cost);

    // Gradient descent
    this.params = this.params.map((param, i) => {
      // TODO: fix with https://wikimedia.org/api/rest_v1/media/math/render/svg/1287a455b42c47dadf958a42cc4164c38abfbfd0
      var sum = samples.reduce((acc, sample, row) => {
        var diff = scores[row] - labels[row][0];
        var sum = sample.reduce((acc, x) => {
          return acc + diff * x;
        }, diff);
        return acc + sum;
      }, 0);

      var newParam = param - alpha * sum;
      // console.log(`Gradient descent ${10 - maxEpochs}/${i}: ${param} - ${alpha} * ${sum} == ${newParam}`)
      return newParam;
    });
    // console.log('---')
  }
};

/**
 *
 * @param {Array<number>} inputs
 */
LinearRegressionModel.prototype.score = function (inputs) {
  if (inputs.length !== this.params.length - 1) {
    throw new Error(`Input size mismatch. Your input must have length of ${this.params.length - 1}`);
  }

  return inputs.reduce((acc, input, i) => {
    return acc + input * this.params[i];
  }, this.params[0]);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LinearRegressionModel;
}
