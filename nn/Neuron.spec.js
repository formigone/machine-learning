import Neuron from './Neuron';
import { expect } from 'chai';

describe('Neuron', () => {
  it('Has N + 1 weights', () => {
    const n = 1;
    const neuron = new Neuron(n);
    expect(neuron.weights.length).to.equal(n + 1);
  });

  it('Adds bias term when doting some input', () => {
    const neuron = new Neuron(1);
    neuron.weights = [1, 2];
    const sum = neuron.dot([3]);
    expect(sum).to.equal(1 * 1 + 2 * 3);
  });

  it('Raises error if invalid activator is specified', () => {
    const neuron = new Neuron(1);
    expect(neuron.activate.bind(neuron, [1], 'fake-activator')).to.throw();
  });

  it('Implements softmax activator', () => {
    expect(Neuron.activators.Softmax(0)).to.equal(0.5);
    expect(Neuron.activators.Softmax(-999999)).to.equal(0);
    expect(Neuron.activators.Softmax(999999)).to.equal(1);
  });

  it('Implements relu activator', () => {
    expect(Neuron.activators.ReLU(0)).to.equal(0);
    expect(Neuron.activators.ReLU(10)).to.equal(10);
    expect(Neuron.activators.ReLU(-10)).to.equal(0);
  });
});
