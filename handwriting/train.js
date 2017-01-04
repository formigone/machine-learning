// https://github.com/junku901/machine_learning

const ml = require('machine_learning');
const fs = require('fs');
const MAX_SAMPLES = Number(process.env.MAX_SAMPLES) || 10;
const MAX_TESTS = Number(process.env.MAX_TESTS) || 10;

function makeLabel(val) {
  const label = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  label[val] = 1;
  return label;
}

function predToInt(vals) {
  let max = 0;
  let maxIndex = 0;
  vals.forEach((val, index) => {
    if (val > max) {
      max = val;
      maxIndex = index;
    }
  });
  return maxIndex;
}

// TODO: train each file individually
fs.readFile('./data/train.csv', (err, data) => {
  if (err) {
    throw err;
  }

  const file = data.toString().split('\n');
  const x = [];
  const y = [];
  const testX = [];
  const testY = [];

  file.forEach((row, i) => {
    if (i > 0 && i < MAX_SAMPLES + MAX_TESTS + 1) {
      const data = row.split(',').map((val, index) => {
        if (index === 0) {
          return Number(val);
        }
        return val === '0' ? 0 : 1;
      });
      const label = data.splice(0, 1).map(val => Number(val));

      if (i < MAX_SAMPLES + 1) {
        x.push(data);
        y.push(makeLabel(label[0]));
      } else {
        testX.push(data);
        testY.push(label);
      }
    }
  });

  const classifier = new ml.LogisticRegression({
    'input': x,
    'label': y,
    'n_in': x[0].length,
    'n_out': y[0].length,
  });

  classifier.set('log level', 1);
  classifier.train({
    'lr': 0.003,
    'epochs': 500,
  });

  console.error(JSON.stringify({ weights: classifier.W, bias: classifier.b }));

  let correct = 0;
  let wrong = 0;
  testX.forEach((test, i) => {
    const prediction = classifier.predict([test]);
    const digit = predToInt(prediction[0]);
    console.log(`Input: ${testY[i]}`);
    // console.log(`Prediction: ${prediction}`);
    console.log(`Result : ${digit}`);
    if (digit == testY[i]) {
      correct += 1;
    } else {
      wrong += 1;
    }
  });

  console.log(`Success: ${parseInt(correct / testX.length * 100, 10)}%  (${correct}/${wrong})`);
});
