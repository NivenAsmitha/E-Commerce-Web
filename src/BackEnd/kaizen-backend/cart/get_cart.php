<?php
// ✅ CORS & Content Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// ✅ Handle preflight request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Load DB connection
require_once __DIR__ . '/../config/db.php'; // update path if needed

$user_id = intval($_GET['user_id'] ?? 0);
$response = ["items" => []];

if ($user_id > 0) {
    $sql = "SELECT ci.product_id, ci.name, ci.size, ci.price, ci.quantity, ci.image_url
            FROM cart_items ci
            JOIN carts c ON ci.cart_id = c.id
            WHERE c.user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $response["items"][] = $row;
        }
    }
    $stmt->close();
}

echo json_encode($response);
$conn->close();
