<?php
$host = "localhost";
$user = "root"; // change this for live host
$password = ""; // change this for live host
$dbname = "snake_game";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
