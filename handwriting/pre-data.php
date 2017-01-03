<?php

$label = getenv('LABEL') ?: '0';
$trainingSet = fopen(__DIR__ . '/data/train.csv', 'r');
$line = fgets($trainingSet);

while ($line !== false) {
    if ($line[0] === $label) {
        $row = explode(',', $line);
        array_shift($row);
        if (is_numeric($label)) {
            echo implode(',', $row);
        }
    }
    $line = fgets($trainingSet);
}

fclose($trainingSet);
