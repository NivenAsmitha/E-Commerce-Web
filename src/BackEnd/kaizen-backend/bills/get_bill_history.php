<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/config/db.php';

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['error' => 'User ID required']);
    exit;
}

$query = "SELECT * FROM bills WHERE user_id = ? ORDER BY id DESC";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$bills = [];

while ($bill = $result->fetch_assoc()) {
    $bill_id = $bill['id'];

    $items_stmt = $conn->prepare("SELECT * FROM bill_items WHERE bill_id = ?");
    $items_stmt->bind_param("i", $bill_id);
    $items_stmt->execute();
    $items_result = $items_stmt->get_result();

    $bill['items'] = [];
    while ($item = $items_result->fetch_assoc()) {
        $bill['items'][] = $item;
    }

    $bills[] = $bill;
}

echo json_encode($bills);
?>
