<?php
/**
 * M-Pesa Callback Handler
 * 
 * Receives payment confirmation from Safaricom and updates payment status
 */

require_once '../config/Database.php';

// Get callback data from Safaricom
$callback_data = file_get_contents('php://input');

// Log for debugging (important for troubleshooting)
$log_dir = __DIR__ . '/../../logs';
if (!file_exists($log_dir)) {
    @mkdir($log_dir, 0755, true);
}
$log_file = $log_dir . '/mpesa_callbacks.log';
file_put_contents($log_file, date('Y-m-d H:i:s') . " - " . $callback_data . "\n", FILE_APPEND);

$response = json_decode($callback_data, true);

if (!$response || !isset($response['Body']['stkCallback'])) {
    echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    exit;
}

$callback = $response['Body']['stkCallback'];
$result_code = $callback['ResultCode'] ?? null;
$checkout_request_id = $callback['CheckoutRequestID'] ?? null;

if (!$checkout_request_id) {
    echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    exit;
}

$db = Database::getConnection();
$checkout_escaped = Database::escape($checkout_request_id);

if ($result_code === 0) {
    // Payment successful
    $items = $callback['CallbackMetadata']['Item'] ?? [];
    $transaction_id = null;
    $receipt_number = null;
    
    foreach ($items as $item) {
        if ($item['Name'] === 'MpesaReceiptNumber') {
            $receipt_number = $item['Value'];
        }
        if ($item['Name'] === 'TransactionDate') {
            $transaction_id = $item['Value'];
        }
    }
    
    $receipt_escaped = $receipt_number ? "'" . Database::escape($receipt_number) . "'" : 'NULL';
    $trans_escaped = $transaction_id ? "'" . Database::escape($transaction_id) . "'" : 'NULL';
    
    // Update payment record
    $db->query("UPDATE payments 
                SET status = 'completed', 
                    mpesa_transaction_id = $trans_escaped, 
                    mpesa_receipt_number = $receipt_escaped,
                    completed_at = NOW() 
                WHERE checkout_request_id = '$checkout_escaped'");
    
    // Get payment details
    $result = $db->query("SELECT user_id, course_id, id FROM payments WHERE checkout_request_id = '$checkout_escaped' LIMIT 1");
    
    if ($result->num_rows > 0) {
        $payment = $result->fetch_assoc();
        $user_id = (int)$payment['user_id'];
        $course_id = (int)$payment['course_id'];
        $payment_id = (int)$payment['id'];
        
        // Create enrollment
        $db->query("INSERT IGNORE INTO course_enrollments (user_id, course_id, payment_id) 
                    VALUES ($user_id, $course_id, $payment_id)");
    }
} else {
    // Payment failed
    $db->query("UPDATE payments 
                SET status = 'failed' 
                WHERE checkout_request_id = '$checkout_escaped'");
}

echo json_encode(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
