<?php
require 'db.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$result = $conn->query("SELECT DISTINCT users.id, users.username, users.email FROM users
   JOIN messages ON users.id = messages.user_id
   WHERE users.role = 'user'");
$users = [];
while ($u = $result->fetch_assoc()) $users[] = $u;
echo json_encode($users);
?>
