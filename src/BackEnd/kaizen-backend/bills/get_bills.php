<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
if (str_starts_with($origin, 'http://localhost')) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once("../config/db.php");

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "Missing user_id"]);
    exit;
}

// Fetch all bills
$billsQuery = "SELECT * FROM bills WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($billsQuery);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$billsResult = $stmt->get_result();

$bills = [];

while ($bill = $billsResult->fetch_assoc()) {
    // Fetch items for this bill
    $itemsQuery = "SELECT * FROM order_items WHERE bill_id = ?";
    $itemStmt = $conn->prepare($itemsQuery);
    $itemStmt->bind_param("i", $bill['id']);
    $itemStmt->execute();
    $itemsResult = $itemStmt->get_result();

    $items = [];
    while ($item = $itemsResult->fetch_assoc()) {
        $items[] = $item;
    }

    $bill['items'] = $items;
    $bills[] = $bill;
}

echo json_encode([
    "status" => "success",
    "bills" => $bills
]);
