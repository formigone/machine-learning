require('console.table');
var fs = require('fs');
var { genArray } = require('./arrayHelper');

const LinearRegressionModel = require('./LinearRegressionModel');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  var counter = array.length;

  while (counter > 0) {
    var index = Math.floor(Math.random() * counter);
    counter--;
    var temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/**
 * Generates samples representing an amount of food ordered (in oz.), with a last column being the total cost for such order.
 * Example:
 *
 * ```
 * // prices => Rice: 1 ($/oz), Beans: 2 ($/oz), Water: 3 ($/oz), Milk: 4 ($/oz)
 * // output:
 * [
 *    [4, 4, 0, 16, 76],
 *    [0, 0, 32, 0, 96],
 *    ...
 * ]
 * ```
 *
 * @param {Array<number>} prices
 * @param {number} rows
 * @returns {Array<Array<number>>}
 */
function genPriceData(prices, rows) {
  return genArray(rows, () => (
    genArray(prices.length + 1, (row, i) => {
      if (i < prices.length) {
        return Number(Math.random() * randInt(0, 10)).toFixed(4) * 1;
      } else {
        return Number(row.reduce((acc, amount, i) => acc + amount * prices[i], 0)).toFixed(2) * 1;
      }
    })
  ));
}

function splitTrainingTest(data, percentageInTraining, shuffleData) {
  shuffleData = shuffleData || false;

  if (shuffleData) {
    data = shuffle(data);
  }

  var totalTraining = Math.floor(data.length * percentageInTraining)
  var training = data.slice(0, totalTraining);
  var test = data.slice(totalTraining);

  return [
    // x_train
    training.map(row => row.slice(0, -1)),
    // x_test
    test.map(row => row.slice(0, -1)),
    // y_train
    training.map(row => row.slice(-1)),
    // y_test
    test.map(row => row.slice(-1)),
  ]
}

/**
 *
 * @param {Array<Array<number>>} data
 * @param {LinearRegressionModel} linearModel
 * @param {Function=} logCallback
 */
function train(data, linearModel, logCallback) {
  logCallback = logCallback || function(){};

  /**
   * @type {Array<Array<number>>} xTrain
   * @type {Array<Array<number>>} xTest
   * @type {Array<Array<number>>} yTrain
   * @type {Array<Array<number>>} yTest
   */
  [xTrain, xTest, yTrain, yTest] = splitTrainingTest(data, 0.7, true);

  console.table('xTest', xTest.slice(0, 5));
  console.table('yTest', yTest.slice(0, 5));

  console.table('Model parameters', linearModel.params);

  linearModel.train(xTrain, yTrain, {
    learningRate: 0.0000003,
    maxCost: 0.000001,
    epochs: 2500000,
    logCost: 1000,
    logCallback: logCallback
  });

  // var sampleToScore = genArray(25, 0);
  // sampleToScore[5] = 2;
  // console.table('To input', [sampleToScore]);
  // console.table('Expected', Number([prices[5] * sampleToScore[5]]).toFixed(2));
  //
  // var score = linearModel.score(sampleToScore);
  // console.table('Score', [Number(score).toFixed(2)]);

  var totalCorrect = 0;
  var totalWrong = 0;
  var totalPredictions = 0;
  xTest.forEach((sample, i) => {
    var prediction = Number(linearModel.score(sample)).toFixed(2);
    var expected = String(yTest[i]);
    if (expected.match(/\.\d$/)) {
      expected += '0';
    }
    totalPredictions += 1;
    if (prediction != expected) {
      console.table('Prediction', [{ i: i, expected: yTest[i], actual: prediction }]);
      totalWrong += 1;
    } else {
      totalCorrect += 1;
    }
  });

  console.table('Accuracy', [{ total: totalPredictions, correct: totalCorrect, wrong: totalWrong }])
}


function main() {
  var dataFilename = `${__dirname}/prices-5000.json`;
  var paramsFilename = `${__dirname}/prices-5000-params.json`;

  fs.readFile(dataFilename, (err, data) => {
    data = JSON.parse(data.toString());
    var linearModel = new LinearRegressionModel(data[0].length - 1);
    var params = fs.readFileSync(paramsFilename);
    params = JSON.parse(params);
    linearModel.setParams(params);
    var logCallback = function (data) {
      var cost = data.cost;
      var params = data.model.getParams();
      console.log('cost', cost);
      fs.writeFileSync(paramsFilename, JSON.stringify(params));
      // console.log(`Saved model parameters (${paramsFilename}, ${params.length})`);
    };
    train(data, linearModel, logCallback);
  });

  // Generate + persist data
  // var prices = genArray(20, (arr, i) => i + 1);
  // var data = genPriceData(prices, 5000);
  //
  // fs.writeFile(dataFilename, JSON.stringify(data), (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //
  //   console.log('Saved data');
  //   train(data);
  // });
}

main();
