<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

require_once __DIR__ . '/../model/Order.php';

class PaymentController {
    public function simulatePayment($orderData, $items) {
        $order = new Order();
        if ($order->create($orderData, $items)) {
            echo json_encode(['status' => 'success', 'message' => 'Order placed successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Order failed']);
        }
    }
}
