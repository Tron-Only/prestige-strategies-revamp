<?php
/**
 * M-Pesa Payment Initiation (STK Push)
 * 
 * Initiates M-Pesa STK Push for course payment
 */

require_once '../config/cors.php';
require_once '../config/Database.php';
require_once '../config/JWTHelper.php';
require_once '../config/auth_middleware.php';
require_once '../config/Config.php';

// Verify user is logged in
$user = AuthMiddleware::verify('user');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$data = json_decode(file_get_contents('php://input'), true);
$course_id = $data['course_id'] ?? null;
$phone_number = $data['phone_number'] ?? null;

if (!$course_id || !$phone_number) {
    http_response_code(400);
    exit(json_encode(['error' => 'Course ID and phone number required']));
}

// Validate phone number format (254XXXXXXXXX)
$phone_number = preg_replace('/[^0-9]/', '', $phone_number);
if (!preg_match('/^254[0-9]{9}$/', $phone_number)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid phone number format. Use 254XXXXXXXXX']));
}

// Get course details
$db = Database::getConnection();
$course_id = (int)$course_id;
$result = $db->query("SELECT id, title, price FROM courses WHERE id = $course_id AND status = 'published' LIMIT 1");

if ($result->num_rows === 0) {
    http_response_code(404);
    exit(json_encode(['error' => 'Course not found']));
}

$course = $result->fetch_assoc();

// Check if already enrolled
$user_id = (int)$user['user_id'];
$result = $db->query("SELECT id FROM course_enrollments WHERE user_id = $user_id AND course_id = $course_id LIMIT 1");

if ($result->num_rows > 0) {
    http_response_code(400);
    exit(json_encode(['error' => 'Already enrolled in this course']));
}

// Check if test mode is enabled
$test_mode = Config::get('MPESA_TEST_MODE') === 'true';

if ($test_mode) {
    // TEST MODE: Simulate successful payment without calling M-Pesa API
    $checkout_request_id = 'TEST_' . time() . '_' . rand(1000, 9999);
    $phone_escaped = Database::escape($phone_number);
    $checkout_escaped = Database::escape($checkout_request_id);
    
    // Create pending payment record
    $db->query("INSERT INTO payments (user_id, course_id, amount, currency, phone_number, checkout_request_id, status) 
                VALUES ($user_id, $course_id, {$course['price']}, 'KES', '$phone_escaped', '$checkout_escaped', 'pending')");
    
    $payment_id = $db->insert_id;
    
    // Simulate successful payment after 2 seconds (in test mode, auto-complete)
    // In real scenario, this would be done by the M-Pesa callback
    sleep(1);
    $db->query("UPDATE payments 
                SET status = 'completed', 
                    mpesa_transaction_id = 'TEST" . time() . "', 
                    mpesa_receipt_number = 'TEST" . rand(100000, 999999) . "',
                    completed_at = NOW() 
                WHERE id = $payment_id");
    
    // Create enrollment immediately
    $db->query("INSERT IGNORE INTO course_enrollments (user_id, course_id, payment_id) 
                VALUES ($user_id, $course_id, $payment_id)");
    
    echo json_encode([
        'success' => true,
        'test_mode' => true,
        'checkout_request_id' => $checkout_request_id,
        'payment_id' => $payment_id,
        'message' => 'TEST MODE: Payment simulated successfully'
    ]);
    exit;
}

// Generate M-Pesa access token
$consumer_key = Config::get('MPESA_CONSUMER_KEY');
$consumer_secret = Config::get('MPESA_CONSUMER_SECRET');
$credentials = base64_encode($consumer_key . ':' . $consumer_secret);

$env = Config::get('MPESA_ENVIRONMENT') === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

$auth_url = $env . '/oauth/v1/generate?grant_type=client_credentials';
$ch = curl_init($auth_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For sandbox/testing
$auth_response = json_decode(curl_exec($ch), true);
curl_close($ch);

if (!isset($auth_response['access_token'])) {
    http_response_code(500);
    exit(json_encode(['error' => 'Failed to authenticate with M-Pesa']));
}

$access_token = $auth_response['access_token'];

// Prepare STK Push request
$shortcode = Config::get('MPESA_SHORTCODE');
$passkey = Config::get('MPESA_PASSKEY');
$timestamp = date('YmdHis');
$password = base64_encode($shortcode . $passkey . $timestamp);

$stk_url = $env . '/mpesa/stkpush/v1/processrequest';
$amount = (int)$course['price'];
$callback_url = Config::get('MPESA_CALLBACK_URL');

$stk_data = [
    'BusinessShortCode' => $shortcode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerPayBillOnline',
    'Amount' => $amount,
    'PartyA' => $phone_number,
    'PartyB' => $shortcode,
    'PhoneNumber' => $phone_number,
    'CallBackURL' => $callback_url,
    'AccountReference' => 'Course-' . $course_id,
    'TransactionDesc' => 'Payment for ' . substr($course['title'], 0, 30)
];

$ch = curl_init($stk_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $access_token,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($stk_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For sandbox/testing
$stk_response = json_decode(curl_exec($ch), true);
curl_close($ch);

// Store payment record
$checkout_request_id = $stk_response['CheckoutRequestID'] ?? null;
$response_code = $stk_response['ResponseCode'] ?? null;

if ($response_code === '0' && $checkout_request_id) {
    $phone_escaped = Database::escape($phone_number);
    $checkout_escaped = Database::escape($checkout_request_id);
    
    $db->query("INSERT INTO payments (user_id, course_id, amount, currency, phone_number, checkout_request_id, status) 
                VALUES ($user_id, $course_id, {$course['price']}, 'KES', '$phone_escaped', '$checkout_escaped', 'pending')");
    
    $payment_id = $db->insert_id;
    
    echo json_encode([
        'success' => true,
        'checkout_request_id' => $checkout_request_id,
        'payment_id' => $payment_id,
        'message' => 'STK Push sent to ' . $phone_number
    ]);
} else {
    http_response_code(500);
    $error_message = $stk_response['errorMessage'] ?? $stk_response['ResponseDescription'] ?? 'Failed to initiate payment';
    exit(json_encode(['error' => $error_message]));
}
