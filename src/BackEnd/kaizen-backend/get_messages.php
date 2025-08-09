<?php
// Optional for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// CORS and content-type headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database
require 'db.php';

// Validate user_id from query string
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing user_id"]);
    exit();
}

// Fetch messages from support_messages table
try {
    $stmt = $conn->prepare("
        SELECT * FROM support_messages
        WHERE user_id = ?
        ORDER BY created_at ASC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $messages = [];

    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            "id" => intval($row["id"]),
            "user_id" => intval($row["user_id"]),
            "message" => $row["message"],
            "reply" => $row["reply"],
            "support_id" => $row["support_id"] !== null ? intval($row["support_id"]) : null,
            "status" => $row["status"],
            "created_at" => $row["created_at"],
            "replied_at" => $row["replied_at"]
        ];
    }

    echo json_encode($messages);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
?>
