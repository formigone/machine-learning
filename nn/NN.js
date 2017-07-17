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

NN.prototype._forward = function (inputs, l = 0) {
  // console.log(`Forwarding layer ${l + 1}/${this.layers.length + 1}`);
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
    // console.log(` Activating a^${l}, ${i} => ${inputs}`);
    return neuron.activate(inputs, activator)
  });

  return this._forward(output, l + 1);
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
    const diff = el - actual[i];
    return acc + diff * diff;
  }, 0);

  const coeff = - (1 / totalTrainingExamples);
  return coeff * sum;
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
  throw new Error('TODO: implement regularization term calculation');
};

export default NN;
