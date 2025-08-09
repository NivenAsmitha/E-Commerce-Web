<?php
// Enable error reporting (for debugging)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set response headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require 'db.php';

// Read and decode the incoming JSON
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (!isset($data->id) || !isset($data->reply) || !isset($data->support_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit();
}

$id = intval($data->id);
$reply = trim($data->reply);
$support_id = intval($data->support_id);

// Check if reply is empty
if ($reply === '') {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Reply cannot be empty"]);
    exit();
}

try {
    // ✅ FIXED: Set status to 'closed' not 'replied'
    $stmt = $conn->prepare("UPDATE support_messages 
                            SET reply = ?, support_id = ?, replied_at = NOW(), status = 'closed' 
                            WHERE id = ?");
    $stmt->bind_param("sii", $reply, $support_id, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "No message found with that ID"]);
        }
    } else {
        throw new Exception($stmt->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
