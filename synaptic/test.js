require('console.table');
const synaptic = require('synaptic');

function dist(a, b) {
  const x = a[0] - b[0];
  const y = a[1] - b[1];

  return Math.sqrt(x * x + y * y);
}

const points = [];
const colors = {
  pos: '#3c5cff',
  neg: '#f956ff',
};

const circle1 = [600 / 2, 300 / 5 * 3, 300 / 1.5];
const circle2 = [600 / 3, 300 / 5, 300 / 2.5];

for (let y = 0; y < 300; y++) {
  for (let x = 0; x < 600; x++) {
    let point = [x, y, colors.pos];

    if (dist(point, circle1) < circle1[2] && dist(point, circle2) > circle2[2]) {
      point[2] = colors.neg;
    }

    points.push(point);
  }
}

let xTrain = points.map(([x, y]) => [x / 600, y / 300]);
let yTrain = points.map(([x, y, color]) => [Number(color === colors.pos)]);

console.table(xTrain.slice(0, 10));
console.table(yTrain.slice(0, 10));

const L1 = new synaptic.Layer(2);
const L2 = new synaptic.Layer(8);
const L3 = new synaptic.Layer(8);
const L4 = new synaptic.Layer(1);

L1.project(L2);
L2.project(L3);
L3.project(L4);

const net = new synaptic.Network({
  input: L1,
  hidden: [L2, L3],
  output: L4,
});

const trainer = new synaptic.Trainer(net);

console.log('Training...');
trainer.train(xTrain.map((input, i) => {
  if (i % 50 === 0) {
    return { input, output: yTrain[i] };
  }
}).filter(_ => _), {
  rate: 0.003,
  shuffle: true,
  // log: 100,
});

const test = trainer.test(xTrain.map((input, i) => ({ input, output: yTrain[i]})));
console.log(test);
