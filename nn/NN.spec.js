import NN from './NN';
import { expect } from 'chai';

describe('NN', () => {
  it('Network has right amount of layers', () => {
    const net = new NN([1, 2, 3]);
    expect(net.layers.length).to.equal(2);
    expect(net.layers[0].length).to.equal(2);
    expect(net.layers[1].length).to.equal(3);
  });

  it('Layers have right amount of weights (including T0 (bias)', () => {
    const net = new NN([1, 2, 3]);
    expect(net.layers[0][0].weights.length).to.equal(2);
    expect(net.layers[0][1].weights.length).to.equal(2);

    expect(net.layers[1][0].weights.length).to.equal(3);
    expect(net.layers[1][1].weights.length).to.equal(3);
    expect(net.layers[1][2].weights.length).to.equal(3);
  });

  it('Forward props like a boss', () => {
    const net = new NN([1, 1, 1], { hiddenActivator: 'ReLU', outputActivator: 'ReLU' });
    const W = [
      [1, 2],
      [3, 4],
    ];
    //      Input -----------------------+
    // Bias --------------------+        |
    //                          |        |
    //                          v        v
    net.layers[0][0].weights = [W[0][0], W[0][1]];
    net.layers[1][0].weights = [W[1][0], W[1][1]];

    const input = [[0]];
    const output = net._forward(input);

    const a0 = 1 * net.layers[0][0].weights[0] + input[0][0] * net.layers[0][0].weights[1];
    const a1 = 1 * net.layers[1][0].weights[0] + a0 * net.layers[1][0].weights[1];

    expect(output.length).to.equal(1);
    expect(output[0]).to.equal(a1);
  });
});
