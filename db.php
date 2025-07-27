<?php
$host = 'your_render_db_host';
$db   = 'snake_game';
$user = 'your_user';
$pass = 'your_password';
$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
