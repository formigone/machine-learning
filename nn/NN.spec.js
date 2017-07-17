import NN from './NN';
import { expect } from 'chai';

describe('NN', () => {
  it('Network has right amount of layers', () => {
    //       ()
    //       / \
    //     ()   ()    Layer 0
    //    / \`.`/ \
    //   /_,'\ /`._\
    //  ()   ()    () Layer 1
    let net = new NN([1, 2, 3]);
    expect(net.layers.length).to.equal(2);
    expect(net.layers[0].length).to.equal(2);
    expect(net.layers[1].length).to.equal(3);

    //     ()   ()
    //     | \ / |
    //     |.` `.|
    //     ()   ()  Layer 0
    //     | \ / |
    //     |.` `.|
    //     ()   ()  Layer 1
    net = new NN([2, 2, 2]);
    expect(net.layers.length).to.equal(2);
    expect(net.layers[0].length).to.equal(2);
    expect(net.layers[1].length).to.equal(2);

    //     ()   ()
    //   / | \ / | \
    // ()  ()   ()  ()  Layer 0
    // | \/| \ /| \/|
    // ()  ()   ()  ()  Layer 1
    //   \ | \ /|  /
    //     ()   ()      Layer 2
    net = new NN([2, 4, 4, 2]);
    expect(net.layers.length).to.equal(3);
    expect(net.layers[0].length).to.equal(4);
    expect(net.layers[1].length).to.equal(4);
    expect(net.layers[2].length).to.equal(2);

    //     ()   ()
    //   / | \ / | \
    // ()  ()   ()  ()  Layer 0
    // | \/| \ /| \/|
    // ()  ()   ()  ()  Layer 1
    //   `._\  / _,'
    //       ()         Layer 2
    net = new NN([2, 4, 4, 1]);
    expect(net.layers.length).to.equal(3);
    expect(net.layers[0].length).to.equal(4);
    expect(net.layers[1].length).to.equal(4);
    expect(net.layers[2].length).to.equal(1);
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

  it('Computes regularization term', () => {
    const net = new NN([1, 1, 1], { regularization: 1.0 });
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

    const regu = net._regularize(2);

    //  ()  input layer
    //  ()  => W := [w[0, 0], w[0, 1]]
    //  ()  => W := [w[1, 0], w[1, 1]]
    //                    ^
    //                     `- corresponds to bias term

    const lambda = 2;
    const totalTrainingExamples = 2;

    const expectedRegVal = lambda / (2 * totalTrainingExamples) * (
      (W[0][1] * W[0][1]) +
      (W[1][1] * W[1][1])
    );

    expect(regu).to.equal(expectedRegVal);
  });

  it('Computes cost J(t)', () => {
    const net = new NN([2, 4, 1], { hiddenActivator: 'ReLU', outputActivator: 'ReLU' });

    // 2x2 grid
    //
    // 1 | 1 | 1
    // --+---+--
    // 1 | 1 | 0
    // --+---+--
    // 1 | 0 | 0
    const inputs = [[0, 0], [2, 2]];
    const labels = [[1], [0]];

    const cost_x0 = net._cost(labels[0], net._forward(inputs[0]), 1);
    expect(cost_x0).that.is.a('number');
    // expect(output[0]).to.equal(a1);
  });
});
