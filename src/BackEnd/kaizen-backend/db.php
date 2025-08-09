<?php
$host = "localhost";
$user = "root";
$pass = "1234";
$db = "kaizen_shop";

$conn = new mysqli($host, $user, $pass, $db);

// DEBUG LINE: Log success or failure
file_put_contents("db-log.txt", $conn->connect_error ?: "Connected!");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
