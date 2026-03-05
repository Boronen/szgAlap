<?php
$scores = json_decode(file_get_contents("scores.json"), true);

$user = $_POST["user"];

if (!isset($scores[$user])) {
    $scores[$user] = 0;
}

$scores[$user]++;

file_put_contents("scores.json", json_encode($scores, JSON_PRETTY_PRINT));

echo "ok";
?>
