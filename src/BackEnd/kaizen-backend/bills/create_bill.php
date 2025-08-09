<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ CORS fix: Allow preflight and actual request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5174");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Max-Age: 86400");
    exit(0);
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");

require_once("../config/db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["order"], $data["items"])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing order or items"]);
    exit;
}

$order = $data["order"];
$items = $data["items"];

try {
    $conn->begin_transaction();

    $stmt = $conn->prepare("
        INSERT INTO bills (
            user_id, username, first_name, last_name, phone, 
            delivery_address, province, district, total, payment_method, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    $stmt->bind_param(
        "isssssssis",
        $order["user_id"],
        $order["username"],
        $order["firstName"],
        $order["lastName"],
        $order["phone"],
        $order["delivery_address"],
        $order["province"],
        $order["district"],
        $order["total"],
        $order["payment_method"]
    );

    $stmt->execute();
    $bill_id = $conn->insert_id;

    $itemStmt = $conn->prepare("
        INSERT INTO bill_items (
            bill_id, product_id, name, quantity, price, image_url
        ) VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($items as $item) {
        $itemStmt->bind_param(
            "iisiis",
            $bill_id,
            $item["product_id"],
            $item["name"],
            $item["quantity"],
            $item["price"],
            $item["image_url"]
        );
        $itemStmt->execute();
    }

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "Payment successful. Bill generated.",
        "bill_id" => $bill_id
    ]);
} catch (Exception $e) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to process order.",
        "error" => $e->getMessage()
    ]);
}
?>
