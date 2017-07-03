<?php

$dir = scandir(__DIR__);
$dir = array_values(array_filter($dir, function ($file) {
    return !(preg_match('|^\.|', $file));
}));
?>

<ul>
    <?php foreach ($dir as $file): ?>
      <li>
        <a href="<?= $file; ?>"><?= $file; ?></a>
      </li>
    <?php endforeach; ?>
</ul>
