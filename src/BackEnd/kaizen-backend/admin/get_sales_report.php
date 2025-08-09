<?php
// /kaizen-backend/admin/get_sales_report.php

// ===== Dynamic CORS =====
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// ===== DB CONNECTION =====
$root = dirname(__DIR__);
require_once $root . '/db.php';

// ===== CONFIG =====
$dateColumn = 'created_at'; // From your bills table

// ===== Input =====
$type = isset($_GET['type']) ? strtolower(trim($_GET['type'])) : 'daily';
$validTypes = ['daily', 'weekly', 'monthly'];
if (!in_array($type, $validTypes)) {
    $type = 'daily';
}

// ===== WHERE Clause =====
$dateExpr = "DATE(b.$dateColumn)";
$where = []; // No status filter because bills table has no status column

switch ($type) {
    case 'weekly':
        $where[] = "$dateExpr >= (CURDATE() - INTERVAL 7 DAY)";
        break;
    case 'monthly':
        $where[] = "$dateExpr >= (CURDATE() - INTERVAL 30 DAY)";
        break;
    case 'daily':
    default:
        $where[] = "$dateExpr = CURDATE()";
        break;
}

$whereSql = count($where) ? "WHERE " . implode(" AND ", $where) : "";

// ===== Query =====
$sql = "
    SELECT 
        $dateExpr AS date,
        oi.name AS product_name,
        SUM(oi.quantity) AS quantity,
        SUM(oi.quantity * oi.price) AS total
    FROM bills b
    JOIN order_items oi ON oi.bill_id = b.id
    $whereSql
    GROUP BY $dateExpr, oi.name
    ORDER BY date ASC, oi.name ASC
";

$res = $conn->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit;
}

// ===== Output =====
$data = [];
while ($row = $res->fetch_assoc()) {
    $row['quantity'] = (int)$row['quantity'];
    $row['total'] = (float)$row['total'];
    $data[] = $row;
}

echo json_encode($data);
