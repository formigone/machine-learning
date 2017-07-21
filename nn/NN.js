import { genArray, transpose, matMult, matAdd } from './math';
import Neuron from './Neuron';

/**
 *
 * @param {Array<number>} layersConfig List of integers, where list element indicates layer number, and value is amount of nodes in it. Example [3, 4, 5, 6] makes input layer with 3 nodes, output layer with 6 nodes, and two hidden layers with 4 and 5 nodes respectively.
 * @param {Object=} settings
 * @constructor
 */
function NN(layersConfig, settings = {}) {
  /** @type {Array<Neuron>} layers */
  this.layers = layersConfig.map(function (size, l) {
    if (l === 0) {
      return;
    }

    const inputs = layersConfig[l - 1];
    return genArray(size, {
      cb: function (i) {
        // console.log(`Creating unit ${i} on layer ${l + 1} with ${inputs} input${inputs !== 1 ? 's' : ''}`)
        return new Neuron(inputs);
      }
    });
  });

  this.layers.shift();
  this.regularization = settings.regularization || 0.001;
  this._deltas = null;

  this.hiddenActivator = settings.hiddenActivator || 'ReLU';
  this.outputActivator = settings.outputActivator || 'Softmax';
}

/**
 *
 * @param {Array<Array<number>>} samples
 * @param {Array<Array<number>>} labels
 * @param {Object} opt [gradientChecking]: function that receives arguments (i, gradient), where i = ith training example, and gradient = calculated gradient direction
 */
NN.prototype.train = function(samples, labels, opt = { gradientChecking: false, logger: false, maxSteps: 1000, logEvery: -1 }) {
  if (samples.length !== labels.length) {
    throw new Error(`Samples/labels size mismatch during training (${samples.length} samples and ${labels.length} labels)`);
  }

  // const gradientCheckingCb = opt.gradientChecking instanceof Function ? opt.gradientChecking : false;
  const logCb = opt.logger instanceof Function ? opt.logger : false;
  const maxSteps = opt.maxSteps || 1000;
  const logEvery = opt.logEvery || -1;

  for(let step = 0; step < maxSteps; step += 1) {
    samples.forEach((sample, i) => {
      const output = this._forward(sample);
      const deltaL = this._vecDelta(output, labels[i]);
      this._backward(deltaL, null, this._deltas);
    });

    const deltas = this._deltas;
    const m = samples.length;
    const _m = 1 / m;
    this.layers.forEach((layer, l) => {
      layer.forEach((neuron) => {
        neuron.weights = neuron.weights.map((w, j) => w + _m * deltas[l][j]);
      });
    });

    if (logCb && opt.logEvery >= 0 && step % opt.logEvery === 0) {
      logCb(step);
    }
  }
};

/**
 *
 * @param {Array<number>} input
 */
NN.prototype.classify = function(input) {
  return this._forward(input, 0, false, false)
};

/**
 * @param {Array<number>} inputs
 * @param {number=} l
 */
NN.prototype._forward = function (inputs, l = 0, verbose = false, persist = true) {
  if (l >= this.layers.length) {
    return inputs;
  }

  const layer = this.layers[l];
  if (layer[0].weights.length !== inputs.length + 1) {
    throw new Error(`Input size mismatch during forward prop step at layer #${l}`);
  }

  const outputLayer = l === this.layers.length - 1;
  if (verbose) {
    console.log(` >>> ${inputs}(${l})`);
  }
  const activator = outputLayer ? this.outputActivator : this.hiddenActivator;
  if (verbose) {
    console.log(` >>> [${activator}]`);
  }
  const output = layer.map((neuron, i) => {
    // console.log(` Activating a^(${l}), ${i} => ${inputs}`);
    return neuron.activate(inputs, activator, persist)
  });

  if (verbose) {
    console.log(` <<< ${output}`);
  }

  return this._forward(output, l + 1);
};

/**
 *
 * @param {Array<number>} a
 * @param {Array<number>} b
 * @private
 */
NN.prototype._vecDelta = function(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Input size mismatch while computing vector deltas`);
  }

  return a.map((vA, i) => vA - b[i]);
};

/**
 *
 * @returns {Array}
 * @private
 */
NN.prototype._genDeltas = function() {
  return this.layers.map((layer) => genArray(layer.length, { value: 0 }))
};

/**
 *
 * @param {number} l
 * @private
 */
NN.prototype._getActivations = function(l) {
  return this.layers[l].map(({ _activated }) => _activated);
};

/**
 *
 * @param {Array<number>} deltas
 * @param {number=} l
 * @param {Array=} acc
 * @returns {Array}
 * @private
 */
NN.prototype._backward = function (deltas, l = null, acc = null, verbose = false) {
  if (acc === null) {
    this._deltas = this._genDeltas();
    acc = this._deltas;
  }

  if (l === null) {
    l = this.layers.length - 1;
    acc[l] = matAdd(acc[l], this._getActivations(l).map((val) => {
      return deltas.reduce((acc, delta) => acc + delta * val, 0);
    }));
  }

  if (l < 1) {
    return acc;
  }

  const layer = this.layers[l];
  if (layer.length !== deltas.length) {
    throw new Error(`Input size mismatch during backward prop step at layer #${l + 1}`);
  }

  const params = layer.map((neuron) => neuron.weights.slice(1));
  const paramsTranspose = transpose(params);
  const deltaWeights = matMult(paramsTranspose, deltas);
  const activations = this.layers[l - 1].map(({ _activated }) => {
    if (verbose) {
      console.log(`   Back ${_activated} * ${1 - _activated}`)
    }
    return _activated * (1 - _activated);
  });

  if (activations.length !== deltaWeights.length) {
    throw new Error(`Delta weights and activations size mismatch during backward prop step at layer #${l + 1}`);
  }

  if (verbose) {
    console.log(`   Back ${l}, ${deltas} ${deltaWeights} : ${activations}`)
  }

  const deltaL = deltaWeights.map((delta, i) => delta[0] * activations[i]);

  if (verbose) {
    console.log(`   Back ${l}, ${deltaL}`)
  }

  acc[l - 1] = matAdd(acc[l - 1], this._getActivations(l - 1).map((val) => {
    return deltas.reduce((acc, delta) => acc + delta * val, 0);
  }));

  return this._backward(deltaL, l - 1, acc);
};

/**
 * J() => (-1/m) * sum(1:m, sum(1:K, (y[k, i] * log(h(x[i]))[k] + (1 - y[k, i]) * log(1 - h(x[i])[k])) + _regularize()
 *
 * m = number of training examples
 * L = total number of layers in the network
 * K = number of output units/classes
 * s[l] = number of units (not counting bias unit) in layer l
 * y[k, i] = kth unit of the expected output vector given the ith training sample
 * h(x[i]) = output vector from network during forward phase, given ith training sample
 * h(x[i])[k] = kth unit of the actual output vector given the ith training sample
 *
 * @param {Array<number>} expected Labels vector at a given input x
 * @param {Array<number>} actual Activations vector from the entire network form a given input x
 * @param {number} totalTrainingExamples
 * @private
 */
NN.prototype._cost = function(expected, actual, totalTrainingExamples) {
  if (expected.length !== actual.length) {
    throw new Error('Input size mismatch during cost calculation');
  }

  const sum = expected.reduce((acc, el, i) => {
    return acc + (
      expected[i] * (Math.log(actual[i]) || 0) + (1 - expected[i]) * (Math.max(0, Math.log(1 - actual[i])) || 0)
    );
  }, 0);

  const regularization = this._regularize(totalTrainingExamples);
  const coeff = - (1 / totalTrainingExamples);
  return coeff * sum + regularization;
};

/**
 * reg() => (lambda/2 * m) * sum(1:L-1, sum(1:s[l], sum(1:s[l] + 1, W[j, i, l]^2)))
 *
 * m = number to training examples
 *
 * @param {number} totalTrainingExamples
 * @private
 * @return {number}
 */
NN.prototype._regularize = function (totalTrainingExamples) {
  const coeff = this.regularization / (2 * totalTrainingExamples);
  return coeff * this.layers.reduce((acc, layer) => {
      return acc + layer.reduce((acc, unit) => {
          return acc + unit.weights.reduce((acc, weight, i) => {
              return i === 0 ? 0 : acc + weight * weight;
            }, 0);
        }, 0);
    }, 0);
};

export default NN;
