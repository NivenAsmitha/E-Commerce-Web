<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
require 'db.php';

$data = json_decode(file_get_contents("php://input"));
$id = intval($data->id);

if ($id) {
    $sql = "DELETE FROM users WHERE id=$id AND role='support'";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid ID"]);
}
?>
