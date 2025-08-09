<?php
class Bill {
    private $conn;
    private $table = "bills";

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($data) {
        $stmt = $this->conn->prepare("INSERT INTO bills (user_id, username, phone, total, payment_method, delivery_address, province, district, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param(
            "issdssssss",
            $data['user_id'],
            $data['username'],
            $data['phone'],
            $data['total'],
            $data['payment_method'],
            $data['delivery_address'],
            $data['province'],
            $data['district'],
            $data['firstName'],
            $data['lastName']
        );
        $stmt->execute();
        return $stmt->insert_id;
    }
}
