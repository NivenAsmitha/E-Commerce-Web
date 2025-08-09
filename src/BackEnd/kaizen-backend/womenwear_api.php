
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // READ: Get all products
    $sql = "SELECT * FROM womenwear ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $action = isset($data->action) ? $data->action : null;

    if ($action === 'add') {
        // CREATE
        $name = $conn->real_escape_string($data->name);
        $desc = $conn->real_escape_string($data->description);
        $price = floatval($data->price);
        $image = $conn->real_escape_string($data->image_url);
        $sizes = $conn->real_escape_string($data->sizes);
        $sql = "INSERT INTO womenwear (name, description, price, image_url, sizes)
                VALUES ('$name', '$desc', $price, '$image', '$sizes')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to add"]);
        }
        exit();
    }

    if ($action === 'edit') {
        // UPDATE
        $id = intval($data->id);
        $name = $conn->real_escape_string($data->name);
        $desc = $conn->real_escape_string($data->description);
        $price = floatval($data->price);
        $image = $conn->real_escape_string($data->image_url);
        $sizes = $conn->real_escape_string($data->sizes);
        $sql = "UPDATE womenwear SET name='$name', description='$desc', price=$price, image_url='$image', sizes='$sizes' WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to update"]);
        }
        exit();
    }

    if ($action === 'delete') {
        // DELETE
        $id = intval($data->id);
        $sql = "DELETE FROM womenwear WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to delete"]);
        }
        exit();
    }

    // Invalid action
    http_response_code(400);
    echo json_encode(["error" => "Invalid action"]);
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
?>
