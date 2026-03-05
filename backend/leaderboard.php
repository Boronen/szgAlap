<?php
$scores = json_decode(file_get_contents("scores.json"), true);

arsort($scores); 

echo json_encode($scores);
?>
