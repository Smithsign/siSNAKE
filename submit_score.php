<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$stmt = $pdo->prepare("INSERT INTO leaderboard (username, image, score) VALUES (:u, :i, :s)");
$stmt->execute(['u' => $data['username'], 'i' => $data['image'], 's' => $data['score']]);
