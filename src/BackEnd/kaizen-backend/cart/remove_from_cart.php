<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php'; // ✅ Use correct path if this file is inside /cart folder

$data = json_decode(file_get_contents("php://input"), true);

$user_id    = intval($data['user_id']);
$product_id = intval($data['product_id']);
$response   = ['status' => 'failed'];

// ✅ Step 1: Get cart ID
$stmt = $conn->prepare("SELECT id FROM carts WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $cart_id = $row['id'];

    // ✅ Step 2: Delete item from cart
    $del = $conn->prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?");
    $del->bind_param("ii", $cart_id, $product_id);
    $del->execute();
    $del->close();

    $response['status'] = 'removed';
}

$stmt->close();
echo json_encode($response);
$conn->close();
