<?php

require __DIR__ . '/../vendor/autoload.php';

use mcordingley\Regression\Algorithm\LeastSquares;
use mcordingley\Regression\Observations;

ini_set('memory_limit', '6G');

$observations = new Observations();

$trainingSet = fopen(__DIR__ . '/data/train.csv', 'r');
$line = fgets($trainingSet);
$i = 0;
while ($line !== false) {
    $row = explode(',', $line);
    $label = array_shift($row);
    if (is_numeric($label)) {
        $observations->add(array_merge([1.0], array_slice($row, 0, 58)), $label);
    }

    if ($i > 60) {
        break;
    }
    $line = fgets($trainingSet);
}
fclose($trainingSet);

$algorithm = new LeastSquares();
$coefficients = $algorithm->regress($observations);
echo json_encode($coefficients), PHP_EOL;


//$predictor = new Linear($coefficients);
//$predictedOutcome = $predictor->predict(array_merge([1.0], $hypotheticalFeatures));