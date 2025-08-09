<?php
require_once __DIR__ . '/../model/Bill.php';
require_once __DIR__ . '/../model/Order.php';

class BillController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function createBill($orderData, $items) {
        $bill = new Bill($this->conn);
        $order = new Order($this->conn);

        $bill_id = $bill->create($orderData);

        foreach ($items as $item) {
            $order->create($bill_id, $item);
        }

        return $bill_id;
    }
}
