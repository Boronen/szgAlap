<?php
$data = json_decode(file_get_contents("users.json"), true);

$user = $_POST["user"];
$pass = password_hash($_POST["pass"], PASSWORD_DEFAULT);

if (isset($data[$user])) {
    echo "exists";
    exit;
}

$data[$user] = $pass;

file_put_contents("users.json", json_encode($data, JSON_PRETTY_PRINT));

echo "ok";
?>
