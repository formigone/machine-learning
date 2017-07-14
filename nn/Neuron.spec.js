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
});
