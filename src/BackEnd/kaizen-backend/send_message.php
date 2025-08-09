<?php
// Enable CORS and content headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include DB connection
require 'db.php';

// Decode input
$data = json_decode(file_get_contents("php://input"));

$user_id = isset($data->user_id) ? intval($data->user_id) : null;
$message = isset($data->message) ? trim($data->message) : '';

if (!$user_id || $message === '') {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Missing or invalid user_id or message"
    ]);
    exit();
}

// Insert into support_messages
$stmt = $conn->prepare("
    INSERT INTO support_messages (user_id, message, status, created_at)
    VALUES (?, ?, 'open', NOW())
");

$stmt->bind_param("is", $user_id, $message);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message_id" => $conn->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}
?>
