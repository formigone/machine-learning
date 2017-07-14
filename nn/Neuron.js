function Neuron(inputs) {
  this.weights = [];

  for (let i = 0; i < inputs + 1; i++) {
    this.weights.push(Math.random());
  }
}

Neuron.prototype.dot = function (inputs) {
  if (inputs.length + 1 !== this.weights.length) {
    throw new Error('Input size mismatch');
  }

  return [1].concat(inputs)
    .reduce((acc, input, i) => acc + input * this.weights[i], 0);
};

export default Neuron;
