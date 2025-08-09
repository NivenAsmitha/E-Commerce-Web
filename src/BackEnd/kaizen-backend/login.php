<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $conn->real_escape_string($data->username ?? "");
$password = $data->password ?? "";

// Fetch user
$sql = "SELECT id, username, password, role FROM users WHERE username = '$username' LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
  $user = $result->fetch_assoc();

  // Plain text check (not secure, better to use password_verify)
  if ($password === $user['password']) {
    echo json_encode([
      "success" => true, // ✅ THIS IS REQUIRED
      "role" => $user["role"],
      "username" => $user["username"],
      "id" => $user["id"],
    ]);
    exit();
  } else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid username or password"]);
    exit();
  }
} else {
  http_response_code(401);
  echo json_encode(["success" => false, "error" => "Invalid username or password"]);
  exit();
}
?>
