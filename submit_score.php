<?php
$host = "localhost";
$user = "your_user";
$pass = "your_pass";
$dbname = "snake_game";
$conn = new mysqli($host, $user, $pass, $dbname);

$data = json_decode(file_get_contents("php://input"), true);
$name = $conn->real_escape_string($data["username"]);
$image = $conn->real_escape_string($data["image"]);
$score = (int)$data["score"];

$sql = "INSERT INTO leaderboard (username, image, score) VALUES ('$name', '$image', '$score')";
$conn->query($sql);
$conn->close();
?>
