<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php'; // ✅ Correct path if inside /cart folder

$data = json_decode(file_get_contents("php://input"), true);

// Sanitize input
$user_id    = intval($data['user_id']);
$product_id = intval($data['product_id']);
$name       = $conn->real_escape_string($data['name']);
$size       = $conn->real_escape_string($data['size']);
$price      = floatval($data['price']);
$quantity   = intval($data['quantity']);
$image_url  = $conn->real_escape_string($data['image_url']);

$response = ["status" => "failed"];

// ✅ Step 1: Get or create cart
$stmt = $conn->prepare("SELECT id FROM carts WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $cart_id = $row['id'];
} else {
    $insert = $conn->prepare("INSERT INTO carts (user_id) VALUES (?)");
    $insert->bind_param("i", $user_id);
    $insert->execute();
    $cart_id = $conn->insert_id;
    $insert->close();
}
$stmt->close();

// ✅ Step 2: Check if product is already in cart
$check = $conn->prepare("SELECT id FROM cart_items WHERE cart_id = ? AND product_id = ?");
$check->bind_param("ii", $cart_id, $product_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    $update = $conn->prepare("UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?");
    $update->bind_param("iii", $quantity, $cart_id, $product_id);
    $update->execute();
    $update->close();
} else {
    $insert = $conn->prepare("INSERT INTO cart_items (cart_id, product_id, name, size, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $insert->bind_param("iissdis", $cart_id, $product_id, $name, $size, $price, $quantity, $image_url);
    $insert->execute();
    $insert->close();
}

$response['status'] = "success";
echo json_encode($response);
$conn->close();
?>
