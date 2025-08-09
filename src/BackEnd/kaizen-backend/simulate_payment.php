<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read input
$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

if (!isset($input['order']) || !isset($input['items'])) {
    echo json_encode(["status" => "error", "message" => "Missing order data"]);
    exit;
}

require_once __DIR__ . "/config/db.php";
require_once __DIR__ . "/controller/BillController.php";

$orderData = $input['order'];
$items = $input['items'];

try {
    $billController = new BillController($conn);
    $bill_id = $billController->createBill($orderData, $items);

    echo json_encode(["status" => "success", "bill_id" => $bill_id]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
