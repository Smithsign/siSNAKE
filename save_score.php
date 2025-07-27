<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "snake_game";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"), true);

$name = $conn->real_escape_string($data["name"]);
$image = $conn->real_escape_string($data["image"]);
$score = intval($data["score"]);

$sql = "INSERT INTO leaderboard (name, image, score) VALUES ('$name', '$image', $score)";
$conn->query($sql);

$conn->close();
?>
