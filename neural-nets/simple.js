const BASE_PRICE = [4, 8, 15, 16, 23, 42];

const genArr = (len, val = 0) => {
  let arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(val);
  }
  return arr;
};

const randInt = (gte, lt) => parseInt(Math.random() * lt + gte);

const samples = genArr(2).map((val, i) => {
  // const input = genArr(6).map(() => randInt(0, 5));
  const input = ([
    [1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 0],
  ])[i];
  const output = input.reduce((acc, val, i) => acc + val * BASE_PRICE[i], 0);

  return { input, output };
});

// * * * * * * *
const weights = genArr(1).map(() => genArr(BASE_PRICE.length, 10));
const learningRate = 0.03;

const feed = (sample, weights, learningRate = 0.1) => {
  const sigma = sample.input.reduce((acc, val, i) => acc + val * weights[i], 0);
  const resError = sigma - sample.output;
  const deltaWeights = sample.input.map((val, i) => val * learningRate * resError);

  return { sigma, resError, deltaWeights };
};

const activate = (data, weights) => {
  return data.reduce((acc, val, i) => acc + val * weights[i], 0);
};

// x * y === 10 && 2x * y === 15

for (let i = 0; i < 250; i++) {
  const out = feed(samples[0], weights[0], learningRate);
  console.log(`Iteration #${i}`);
  console.log(JSON.stringify(out, null, 2));

  for (let w = 0; w < weights.length; w++) {
    weights[0][w] = weights[0][w] - out.deltaWeights[w];
  }

  console.log('- - - - - - -');
}

const prediction = activate(samples[1].input, weights[0]);
console.log(`Predict: [${samples[1].input}]`);
console.log(`Expected: ${samples[1].output}`);
console.log(`Actual: ${prediction}]`);
