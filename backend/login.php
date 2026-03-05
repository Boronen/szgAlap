<?php
$users = json_decode(file_get_contents("users.json"), true);

$user = $_POST["user"];
$pass = $_POST["pass"];

if (!isset($users[$user])) {
    echo "no_user";
    exit;
}

if (!password_verify($pass, $users[$user])) {
    echo "wrong_pass";
    exit;
}

echo "ok";
?>
