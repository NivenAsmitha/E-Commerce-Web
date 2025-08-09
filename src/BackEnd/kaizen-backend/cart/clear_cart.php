<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content for OPTIONS
    exit();
}

require_once __DIR__ . '/../config/db.php'; // Adjusted path with __DIR__ for reliability

// Initialize response
$response = [
    'status' => 'error',
    'message' => 'Initial error state',
    'cart_id' => null
];

try {
    // Get and validate input
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    if (!isset($input['user_id']) || !is_numeric($input['user_id'])) {
        throw new Exception("Invalid user ID");
    }

    $user_id = (int)$input['user_id'];

    // Start transaction
    $conn->begin_transaction();

    // Step 1: Find cart ID
    $stmt = $conn->prepare("SELECT id FROM carts WHERE user_id = ? FOR UPDATE");
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $user_id);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $cart = $result->fetch_assoc();
    $stmt->close();

    if (!$cart) {
        throw new Exception("No cart found for user");
    }

    $cart_id = $cart['id'];
    $response['cart_id'] = $cart_id;

    // Step 2: Delete all items from this cart
    $delete = $conn->prepare("DELETE FROM cart_items WHERE cart_id = ?");
    if (!$delete) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $delete->bind_param("i", $cart_id);
    if (!$delete->execute()) {
        throw new Exception("Delete failed: " . $delete->error);
    }

    $affected_rows = $delete->affected_rows;
    $delete->close();

    // Commit transaction
    $conn->commit();

    // Prepare success response
    $response = [
        'status' => 'success',
        'message' => 'Cart cleared successfully',
        'cart_id' => $cart_id,
        'items_removed' => $affected_rows
    ];

} catch (Exception $e) {
    // Rollback on error
    if (isset($conn) && $conn instanceof mysqli && $conn->connect_errno === 0) {
        $conn->rollback();
    }

    $response = [
        'status' => 'error',
        'message' => $e->getMessage(),
        'cart_id' => $response['cart_id'] // Preserve cart_id if it was found
    ];

    error_log("Clear Cart Error: " . $e->getMessage());
} finally {
    // Close connection if it exists
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }

    // Send JSON response
    http_response_code($response['status'] === 'success' ? 200 : 400);
    echo json_encode($response);
}