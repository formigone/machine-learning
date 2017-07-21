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

  it('Computes simple regularization term', () => {
    const lambda = 2;
    const totalTrainingExamples = 2;

    const net = new NN([2, 4, 1], { regularization: lambda });
    const W = [
      [1, 2, 3],
      [1, 21, 31],
      [1, 211, 311],
      [1, 2111, 3111],
      [1, 4, 5, 6, 7],
    ];
    //      Input -----------------------+--------+
    // Bias --------------------+        |        |
    //                          |        |        |
    //                          v        v        v
    net.layers[0][0].weights = [W[0][0], W[0][1], W[0][2]];
    net.layers[0][1].weights = [W[1][0], W[1][1], W[1][2]];
    net.layers[0][2].weights = [W[2][0], W[2][1], W[2][2]];
    net.layers[0][3].weights = [W[3][0], W[3][1], W[3][2]];
    net.layers[1][0].weights = [W[4][0], W[4][1], W[4][2], W[4][3], W[4][4]];

    const regu = net._regularize(totalTrainingExamples);

    //  ()  input layer
    //  ()  => W := [w[0, 0], w[0, 1]]
    //  ()  => W := [w[1, 0], w[1, 1]]
    //                    ^
    //                     `- corresponds to bias term


    const expectedRegVal = lambda / (2 * totalTrainingExamples) * (
      (W[0][1] * W[0][1]) +
      (W[0][2] * W[0][2]) +
      (W[1][1] * W[1][1]) +
      (W[1][2] * W[1][2]) +
      (W[2][1] * W[2][1]) +
      (W[2][2] * W[2][2]) +
      (W[3][1] * W[3][1]) +
      (W[3][2] * W[3][2]) +
      (W[4][1] * W[4][1]) +
      (W[4][2] * W[4][2]) +
      (W[4][3] * W[4][3]) +
      (W[4][4] * W[4][4])
    );

    expect(regu).to.equal(expectedRegVal);
  });

  it('Computes complex regularization term', () => {
    const lambda = 2;
    const totalTrainingExamples = 2;

    const net = new NN([1, 1, 1], { regularization: lambda });
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

    const regu = net._regularize(totalTrainingExamples);

    //  ()  input layer
    //  ()  => W := [w[0, 0], w[0, 1]]
    //  ()  => W := [w[1, 0], w[1, 1]]
    //                    ^
    //                     `- corresponds to bias term


    const expectedRegVal = lambda / (2 * totalTrainingExamples) * (
      (W[0][1] * W[0][1]) +
      (W[1][1] * W[1][1])
    );

    expect(regu).to.equal(expectedRegVal);
  });

  it('Computes cost J(t)', () => {
    const totalTrainingExamples = 1;
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

    const coeff = -(1 / totalTrainingExamples);

    let cost = net._cost(labels[0], net._forward(inputs[0]), totalTrainingExamples);
    let out = net._forward(inputs[0]);
    let expected = coeff * (
      labels[0][0] * (Math.log(out[0]) || 0) + (1 - labels[0][0]) * (Math.max(0, Math.log(1 - out[0])) || 0)
      ) + net._regularize(totalTrainingExamples);

    expect(cost).that.is.a('number');
    expect(cost).to.equal(expected);


    cost = net._cost(labels[1], net._forward(inputs[1]), totalTrainingExamples);
    out = net._forward(inputs[1]);
    expected = coeff * (
      labels[1][0] * (Math.log(out[0]) || 0) + (1 - labels[1][0]) * (Math.max(0, Math.log(1 - out[0])) || 0)
      ) + net._regularize(totalTrainingExamples);

    expect(cost).that.is.a('number');
    expect(cost).to.equal(expected);
  });

  it('Computes delta between two vectors', () => {
    const net = new NN([1, 1, 1]);

    let a = [1, 1, 1];
    let b = [0, 0, 0];
    let c = [2, 2, 2];

    expect(net._vecDelta(a, b)).to.deep.equal(a);
    expect(net._vecDelta(a, a)).to.deep.equal(b);
    expect(net._vecDelta(c, a)).to.deep.equal(a);

    try {
      net._vecDelta(a, b.concat(c));
    } catch (e) {
      expect(e).to.be.an('Error');
    }
  });

  it('Calculates deltas array of correct size', () => {
    const net = new NN([2, 4, 8, 4, 2, 1]);
    const deltasArray = net._genDeltas();

    expect(deltasArray.length).to.equal(net.layers.length);
    net.layers.forEach((layer, j) => {
      expect(deltasArray[j].length).to.equal(layer.length);
    });
  });

  it('Collects layer\'s activations', () => {
    const net = new NN([2, 2, 4]);
    net._forward([1, 1]);

    expect(net._getActivations(1).length).to.equal(4);
    expect(net._getActivations(0).length).to.equal(2);
  });

  it('Back propagates error <2 : 4 : 1>', () => {
    const net = new NN([2, 4, 1], { hiddenActivator: 'Softmax', outputActivator: 'Softmax' });

    // 2x2 grid
    //
    // 1 | 1 | 1
    // --+---+--
    // 1 | 1 | 0
    // --+---+--
    // 1 | 0 | 0
    const inputs = [[0, 0], [2, 2]];
    const labels = [[1], [0]];

    const output = net._forward(inputs[0]);
    expect(output).to.be.an('Array');

    const deltaL = net._vecDelta(output, labels[0]);
    const deltas = net._backward(deltaL);

    expect(deltas).to.be.an('Array');
    expect(deltas.length).to.equal(net.layers.length);
    net.layers.forEach((layer, j) => {
      expect(deltas[j].length).to.equal(layer.length);
    });
  });

  it('Back propagates error <2 : 4 : 4 : 8 : 8 : 2>', () => {
    const net = new NN([2, 4, 4, 8, 8, 2], { hiddenActivator: 'Softmax', outputActivator: 'Softmax' });

    // 2x2 grid
    //
    // 1 | 1 | 1
    // --+---+--
    // 1 | 1 | 0
    // --+---+--
    // 1 | 0 | 0
    const inputs = [[0, 0], [2, 2]];
    const labels = [[1, 0], [0, 0]];

    const output = net._forward(inputs[0]);
    expect(output).to.be.an('Array');

    const deltaL = net._vecDelta(output, labels[0]);
    const deltas = net._backward(deltaL);

    expect(deltas).to.be.an('Array');
    expect(deltas.length).to.equal(net.layers.length);
    net.layers.forEach((layer, j) => {
      expect(deltas[j].length).to.equal(layer.length);
    });
  });

  it('Gradient descent decreases close to gradient checking', () => {
    const net = new NN([2, 4, 1], { hiddenActivator: 'Softmax', outputActivator: 'Softmax' });

    // 2x2 grid
    //
    // 1 | 1 | 1
    // --+---+--
    // 1 | 1 | 0
    // --+---+--
    // 1 | 0 | 0
    const inputs = [
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
    ];
    const labels = [
      [1], [1], [1],
      [1], [1], [0],
      [1], [0], [0],
    ];

    net.train(inputs, labels, {
      maxSteps: 5,
      logEvery: 1,
      logger(i) {
        const actual = net._forward(inputs[0], 0, true);
        console.log(`${i} => (${inputs[0]} : ${actual} / ${labels[0]})  ${net._cost(labels[0], actual, 1)}`);
      }
    });
  });
});
