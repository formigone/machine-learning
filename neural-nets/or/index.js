function sigmoid(t) {
  console.log(`  > sig(${t})`);
  return 1 / (1 + Math.exp(-t));
}

const samples = [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 1],
];

const thetas = [
  [-10, 20, 20],
];
const net = [
  [1, 0, 0],
];

function activate(inputs, net) {
  console.log(inputs);
  let a = inputs.map((val) => val);
  net.forEach((layer, l) => {
    a = layer.map((cell, c) => {
      const theta = thetas[l][c];
      const x = c === 0 ? cell : a[c - 1];
      console.log(` > theta: ${theta}  x: ${x}  [${l}, ${c}]`);
      return theta * x;
    })
      .reduce((acc, val) => acc + val);
  });
  return sigmoid(a);
}

samples.forEach((sample) => {
  const res = activate(sample[0], net);
  console.log(res);
});
