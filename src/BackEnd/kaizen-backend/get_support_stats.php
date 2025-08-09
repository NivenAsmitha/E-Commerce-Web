<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

try {
    $stats = [];

    // 1. Total open messages
    $result = $conn->query("SELECT COUNT(*) as count FROM support_messages WHERE status = 'open'");
    $stats['open_messages'] = $result ? (int)$result->fetch_assoc()['count'] : 0;

    // 2. Total replied messages
    $result = $conn->query("SELECT COUNT(*) as count FROM support_messages WHERE status = 'replied'");
    $stats['replied_messages'] = $result ? (int)$result->fetch_assoc()['count'] : 0;

    // 3. Total closed messages
    $result = $conn->query("SELECT COUNT(*) as count FROM support_messages WHERE status = 'closed'");
    $stats['closed_messages'] = $result ? (int)$result->fetch_assoc()['count'] : 0;

    // 4. Active users (with open messages)
    $result = $conn->query("SELECT COUNT(DISTINCT user_id) as count FROM support_messages WHERE status = 'open'");
    $stats['active_users'] = $result ? (int)$result->fetch_assoc()['count'] : 0;

    // 5. Messages sent today
    $result = $conn->query("SELECT COUNT(*) as count FROM support_messages WHERE DATE(created_at) = CURDATE()");
    $stats['todays_messages'] = $result ? (int)$result->fetch_assoc()['count'] : 0;

    echo json_encode($stats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
?>
