<?php
include 'db.php';
$stmt = $pdo->query("SELECT username, image, score FROM leaderboard ORDER BY score DESC LIMIT 100");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
