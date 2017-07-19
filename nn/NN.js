import { genArray } from './math';
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

  this.hiddenActivator = settings.hiddenActivator || 'ReLU';
  this.outputActivator = settings.outputActivator || 'Softmax';
}

/**
 *
 * @param {Array<Array<number>>} samples
 * @param {Array<Array<number>>} labels
 * @param {Object} opt [gradientChecking]: function that receives arguments (i, gradient), where i = ith training example, and gradient = calculated gradient direction
 */
NN.prototype.train = function(samples, labels, opt = { gradientChecking: false }) {
  if (samples.length !== labels.length) {
    throw new Error(`Samples/labels size mismatch during training (${samples.length} samples and ${labels.length} labels)`);
  }

  const gradientCheckingCb = opt.gradientChecking instanceof Function ? opt.gradientChecking : false;

  throw new Error('TODO: implement training method with option to log partial derivatives');
};

NN.prototype._forward = function (inputs, l = 0) {
  if (l >= this.layers.length) {
    return inputs;
  }

  const layer = this.layers[l];
  if (layer[0].weights.length !== inputs.length + 1) {
    throw new Error(`Input size mismatch during forward prop step at layer #${l}`);
  }

  const outputLayer = l === this.layers.length - 1;
  const activator = outputLayer ? this.outputActivator : this.hiddenActivator;
  const output = layer.map((neuron, i) => {
    // console.log(` Activating a^(${l}), ${i} => ${inputs}`);
    return neuron.activate(inputs, activator)
  });

  return this._forward(output, l + 1);
};

NN.prototype._vecDelta = function(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Input size mismatch while computing vector deltas`);
  }

  return a.map((vA, i) => vA - b[i]);
};

NN.prototype._backward = function (deltas, l = null) {
  if (l < 0) {
    console.log(` << return from back prop deltas = ${JSON.stringify(deltas)}`);
    return deltas;
  }

  if (l === null) {
    l = this.layers.length - 1;
  }

  const layer = this.layers[l];
  console.log(` > back prop: l = ${l}/${this.layers.length}, deltas = ${JSON.stringify(deltas)}, layer<${layer.length}>`);
  if (layer.length !== deltas.length) {
    throw new Error(`Input size mismatch during backward prop step at layer #${l}`);
  }

  // TODO: calculate delta^(l-1) correctly
  const deltaL_1 = [];
  const deltaL = layer.map((neuron, i) => {
    const delta = neuron._activated - deltas[i];
    console.log(`  > delta^(${l})[${i}] => ${neuron._activated} - ${deltas[i]}`);
    return neuron.weights.reduce((acc, weight, j) => {
      const val = weight * delta;
      if (j > 0) {
        deltaL_1.push(val);
      }
      console.log(`    > delta^(${l})[${i}, ${j}] => ${weight} * ${delta}`);
      return acc + val;
    }, 0);
  });

  console.log(`  < deltaL => ${deltaL}`)
  return this._backward(deltaL_1, l - 1);
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
