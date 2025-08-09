<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once "db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : "";

if ($q === "") {
    echo json_encode([]);
    exit;
}

$q = $conn->real_escape_string($q);

// Search all category tables
$sql = "
    SELECT id, name, price, image_url, description, 'menswear' AS category 
    FROM menswear 
    WHERE name LIKE '%$q%' OR description LIKE '%$q%'

    UNION
    SELECT id, name, price, image_url, description, 'womenwear' AS category 
    FROM womenwear 
    WHERE name LIKE '%$q%' OR description LIKE '%$q%'

    UNION
    SELECT id, name, price, image_url, description, 'bag' AS category 
    FROM bag 
    WHERE name LIKE '%$q%' OR description LIKE '%$q%'

    UNION
    SELECT id, name, price, image_url, description, 'cap' AS category 
    FROM cap 
    WHERE name LIKE '%$q%' OR description LIKE '%$q%'

    UNION
    SELECT id, name, price, image_url, description, 'footwear' AS category 
    FROM footwear 
    WHERE name LIKE '%$q%' OR description LIKE '%$q%'
";

$result = $conn->query($sql);

$products = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);
?>
