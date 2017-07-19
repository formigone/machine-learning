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

  it('Remembers the last activated value', () => {
    const neuron = new Neuron(4);
    const acts = [];

    acts[0] = neuron.activate([2, 2, 2, 2]);
    expect(neuron._activated).to.equal(acts[0]);

    acts[1] = neuron.activate([3, 3, 3, 3]);
    expect(neuron._activated).to.equal(acts[1]);

    acts[2] = neuron.activate([4, 4, 4, 4]);
    expect(neuron._activated).to.equal(acts[2]);

    expect(acts[0]).to.not.equal(acts[1]);
    expect(acts[0]).to.not.equal(acts[2]);
    expect(acts[1]).to.not.equal(acts[2]);
  });
});
