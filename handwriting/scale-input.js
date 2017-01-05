const fs = require('fs');
const MAX_SAMPLES = Number(process.env.MAX_SAMPLES) || 10;

function scaleRow(data, div = 255) {
  return data.map(val => val / div);
}

fs.readFile('./data/train.csv', (err, data) => {
  if (err) {
    throw err;
  }

  const file = data.toString().split('\n');
  const samples = {};
  file.forEach((row, i) => {
    if (i > 0 && i < MAX_SAMPLES + 1) {
      let data = row.split(',').map(val => Number(val));
      const label = data.splice(0, 1).map(val => Number(val));

      data = scaleRow(data);

      samples[label[0]] = samples[label[0]] || [];
      samples[label[0]].push(data);
    }
  });

  console.error(JSON.stringify(samples));
  process.exit();
});
