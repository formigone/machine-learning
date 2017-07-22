require('console.table');

function genArray(size, opt = {}) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    if ('value' in opt) {
      arr.push(opt.value);
    } else if (opt.cb) {
      arr.push(opt.cb(i));
    } else {
      arr.push(Math.random());
    }
  }

  return arr;
}

function softmax(x, deriv) {
  return x;
  if (deriv) {
    return x * (1 - x);
  }
  return 1 / (1 + Math.exp(-x));
}

function genMatrix(rows, cols, opt = {}) {
  return genArray(rows, opt)
    .map(() => genArray(cols, opt));
}

function matMul(a, b){
  return a.map((row) => {
    return b[0].map((col, j) => {
      return row.reduce((acc, a0, i) => (acc + a0 * b[i][j]), 0);
    });
  })
}

function matAdd(a, b) {
  return a.map((val, i) => val + b[i]);
}

function matSub(a, b) {
  return a.map((val, i) => val - b[i]);
}

function mean(arr) {
  if (arr.length === 0) {
    return 0;
  }

  return arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

const xTrain = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2],
];

const yTrain = [
  [0], [0], [0],
  [0], [0], [1],
  [0], [1], [1],
];

let W1 = genMatrix(8, 2);
let W2 = genMatrix(4, 1);

console.table('W1', W1);
console.table('W2', W2);

let cycles = 1;
for (let i = 0; i < cycles; i++) {
  const l0 = xTrain;
  const l1 = softmax(matMul(l0, W1));
  console.table(l1)
  const l2 = softmax(matMul(l1, W2));

  const l2Error = matSub(yTrain, l2);
  console.log(`Error: ${mean(l2Error)}`);

  const l2Delta = l2Error * softmax(l2, true);
}


throw new Error('This is all wrong!')