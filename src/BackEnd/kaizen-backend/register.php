
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require 'db.php';

$data = json_decode(file_get_contents("php://input"));

$username = $conn->real_escape_string($data->username);
$email = $conn->real_escape_string($data->email);
$password = $conn->real_escape_string($data->password);
$phone = $conn->real_escape_string($data->phone);

$check = $conn->query("SELECT id FROM users WHERE username = '$username'");
if ($check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Username already exists"]);
    exit;
}

$sql = "INSERT INTO users (username, email, password, phone, role)
        VALUES ('$username', '$email', '$password', '$phone', 'user')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to register"]);
}
?>
