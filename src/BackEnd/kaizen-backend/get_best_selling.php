<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "db.php";

// Aggregate sales directly from order_items
$sql = "
    SELECT 
        product_id AS id,
        name,
        price,
        image_url AS image,
        SUM(quantity) AS total_sold
    FROM order_items
    GROUP BY product_id, name, price, image_url
    ORDER BY total_sold DESC
    LIMIT 10
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "error" => "SQL_ERROR",
        "message" => $conn->error
    ]);
    exit;
}

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode($products);
