const { Architect } = require('synaptic');
const fs = require('fs');

const net = new Architect.Perceptron(28 * 28, 28 * 10, 10);

const MAX_SAMPLES = Number(process.env.MAX_SAMPLES) || 100;
const MAX_TESTS = Number(process.env.MAX_TESTS) || 10;

function makeLabel(val) {
  const label = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  label[val] = 1;
  return label;
}

fs.readFile('./data/train.csv', (err, data) => {
  if (err) {
    throw err;
  }

  const file = data.toString().split('\n');
  const samples = [];
  const tests = [];

  console.log(' > File read');
  file.forEach((row, i) => {
    if (i > 0 && i < MAX_SAMPLES + MAX_TESTS + 1) {
      let data = row.split(',').map(val => Number(val));
      let label = data.splice(0, 1).map(val => Number(val));
      label = makeLabel(label);

      data = { input: data, output: label };

      // console.log(label, data);process.exit();

      if (i < MAX_SAMPLES + 1) {
        samples.push(data);
      } else {
        tests.push([data.input, label]);
      }
    }
  });
  console.log(' > Dataset populated');
  console.error(JSON.stringify({
    samples: samples,
    tests: tests,
  }, null, 2));


  const options = {
    rate: .1,
    iterations: 100,
    error: .005,
    log: 10,
  };

  net.trainer.train(samples, options);
  console.log(' > Trained');

  tests.forEach((test) => {
    const data = test[0];
    const label = test[1];
    const res = net.activate(data);
    console.log('Testing ', label);
    console.log(res);
  });
});
