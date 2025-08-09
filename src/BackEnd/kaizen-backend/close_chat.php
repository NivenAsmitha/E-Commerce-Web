<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Preflight request support
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

// Read and decode request
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (!isset($data->user_id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Missing required field: user_id"
    ]);
    exit();
}

$user_id = intval($data->user_id);

try {
    // Close all open messages for this user
    $stmt = $conn->prepare("
        UPDATE support_messages
        SET status = 'closed'
        WHERE user_id = ? AND status = 'open'
    ");
    $stmt->bind_param("i", $user_id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "affected_rows" => $stmt->affected_rows
        ]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}
?>
