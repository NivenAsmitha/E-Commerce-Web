<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require 'db.php';

$data = json_decode(file_get_contents("php://input"));
if (
    empty($data->username) ||
    empty($data->password) ||
    empty($data->email) ||
    empty($data->phone)
) {
    echo json_encode(["error" => "All fields are required"]);
    exit();
}
$username = $conn->real_escape_string($data->username);
$password = $conn->real_escape_string($data->password);
$email = $conn->real_escape_string($data->email);
$phone = $conn->real_escape_string($data->phone);

// Optional: Check if username/email already exists
$exists = $conn->query("SELECT id FROM users WHERE username='$username' OR email='$email'");
if ($exists->num_rows > 0) {
    echo json_encode(["error" => "Username or email already exists"]);
    exit();
}

$sql = "INSERT INTO users (username, password, email, phone, role) VALUES
    ('$username', '$password', '$email', '$phone', 'support')";
if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to add user"]);
}
?>
