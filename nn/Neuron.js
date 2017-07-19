import { genArray, activators } from './math';

function Neuron(inputs) {
  // console.log(`  Creating neuron with ${inputs} input${inputs !== 1 ? 's' : ''}`)
  this.weights = genArray(inputs + 1);

  // Remember what the activation value was during forward feed in order to back propagate the delta
  this._activated = 0;
}

Neuron.activators = activators;

Neuron.prototype.dot = function (inputs) {
  if (inputs.length + 1 !== this.weights.length) {
    throw new Error('Input size mismatch');
  }

  return [1].concat(inputs)
    .reduce((acc, input, i) => acc + input * this.weights[i], 0);
};

Neuron.prototype.activate = function(inputs, func = activators.Softmax.name) {
  if (!(func in Neuron.activators)) {
    throw new Error(`Invalid activator ${func}`);
  }

  this._activated = Neuron.activators[func](this.dot(inputs));
  return this._activated;
};

Neuron.prototype.toString = function() {
  return `Neuron: { weights<${this.weights.length}>, _activated<number> }`
};

export default Neuron;
