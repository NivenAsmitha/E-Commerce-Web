<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connect to database
require 'db.php';

try {
    // ✅ Optimized: Only select users with at least one 'open' message
    $sql = "
        SELECT DISTINCT u.id AS user_id, u.username,
               COUNT(s.id) AS total_messages,
               COUNT(CASE WHEN s.reply IS NULL OR s.reply = '' THEN 1 END) AS unread_count,
               MAX(s.created_at) AS last_message_time
        FROM users u
        INNER JOIN support_messages s ON u.id = s.user_id
        WHERE s.status = 'open'
        GROUP BY u.id, u.username
        HAVING unread_count > 0
        ORDER BY last_message_time DESC
    ";

    $result = $conn->query($sql);
    $users = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                "user_id" => intval($row["user_id"]),
                "username" => $row["username"],
                "total_messages" => intval($row["total_messages"]),
                "unread_count" => intval($row["unread_count"]),
                "last_message_time" => $row["last_message_time"]
            ];
        }
    }

    echo json_encode($users);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
?>
