<?php
$host = "localhost";
$user = "your_user";
$pass = "your_pass";
$dbname = "snake_game";
$conn = new mysqli($host, $user, $pass, $dbname);

$result = $conn->query("SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100");

$scores = [];
while ($row = $result->fetch_assoc()) {
  $scores[] = $row;
}

echo json_encode($scores);
$conn->close();
?>
