<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "snake_game";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100";
$result = $conn->query($sql);

$rows = array();
while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}

echo json_encode($rows);
$conn->close();
?>
