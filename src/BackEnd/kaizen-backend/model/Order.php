<?php
class Order {
    private $conn;
    private $table = "order_items";

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($bill_id, $item) {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} 
            (bill_id, product_category, product_id, name, size, price, quantity, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "iiissdis", // i = int, s = string, d = double
            $bill_id,
            $item['product_category'],
            $item['product_id'],
            $item['name'],
            $item['size'],
            $item['price'],
            $item['quantity'],
            $item['image_url']
        );

        $stmt->execute();
    }
}
