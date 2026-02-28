<?php
/**
 * M-Pesa Daraja API Test Script
 * 
 * Tests if your M-Pesa credentials are valid by generating an access token
 */

require_once 'public/api/config/Config.php';

echo "=== M-Pesa Daraja API Test ===\n\n";

// Load credentials from .env
$consumer_key = Config::get('MPESA_CONSUMER_KEY');
$consumer_secret = Config::get('MPESA_CONSUMER_SECRET');
$environment = Config::get('MPESA_ENVIRONMENT');
$shortcode = Config::get('MPESA_SHORTCODE');
$passkey = Config::get('MPESA_PASSKEY');

echo "Configuration:\n";
echo "- Environment: $environment\n";
echo "- Consumer Key: " . substr($consumer_key, 0, 10) . "...\n";
echo "- Consumer Secret: " . (strlen($consumer_secret) > 0 ? "Set (" . strlen($consumer_secret) . " chars)" : "NOT SET") . "\n";
echo "- Shortcode: $shortcode\n";
echo "- Passkey: " . (strlen($passkey) > 0 ? "Set (" . strlen($passkey) . " chars)" : "NOT SET") . "\n\n";

// Check if credentials are placeholder values
if ($consumer_key === 'your-mpesa-consumer-key' || $consumer_secret === 'your-mpesa-consumer-secret') {
    echo "❌ ERROR: You're using placeholder credentials!\n\n";
    echo "To get real Daraja API credentials:\n";
    echo "1. Go to: https://developer.safaricom.co.ke/\n";
    echo "2. Create an account or log in\n";
    echo "3. Go to 'My Apps' → Create a new app (Lipa Na M-Pesa Online)\n";
    echo "4. Get your Consumer Key and Consumer Secret\n";
    echo "5. For Sandbox testing, use the test credentials provided\n";
    echo "6. Update your .env file with the real credentials\n\n";
    echo "Sandbox Test Credentials (you can use these for testing):\n";
    echo "- Shortcode: 174379\n";
    echo "- Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919\n";
    echo "- Test Phone: 254708374149 (use this number in sandbox)\n\n";
    exit(1);
}

// Test authentication
echo "Testing authentication with Safaricom...\n";

$credentials = base64_encode($consumer_key . ':' . $consumer_secret);
$base_url = $environment === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke';

$auth_url = $base_url . '/oauth/v1/generate?grant_type=client_credentials';

$ch = curl_init($auth_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For sandbox/testing
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
$curl_info = curl_getinfo($ch);
curl_close($ch);

if ($curl_error) {
    echo "❌ CURL Error: $curl_error\n";
    exit(1);
}

echo "HTTP Response Code: $http_code\n";
echo "Response: $response\n";
echo "Content Type: " . $curl_info['content_type'] . "\n";
echo "Total Time: " . $curl_info['total_time'] . "s\n\n";

$auth_response = json_decode($response, true);

if ($http_code === 200 && isset($auth_response['access_token'])) {
    echo "✅ SUCCESS! Your M-Pesa credentials are valid!\n";
    echo "Access Token: " . substr($auth_response['access_token'], 0, 20) . "...\n";
    echo "Expires In: " . $auth_response['expires_in'] . " seconds\n\n";
    echo "You can now test STK Push payments!\n";
    echo "For sandbox testing, use phone number: 254708374149\n";
    exit(0);
} else {
    echo "❌ AUTHENTICATION FAILED!\n\n";
    
    if (isset($auth_response['errorMessage'])) {
        echo "Error: " . $auth_response['errorMessage'] . "\n";
    }
    
    if ($http_code === 401) {
        echo "- Check if your Consumer Key and Consumer Secret are correct\n";
        echo "- Verify you're using the right credentials for " . $environment . " environment\n";
    } elseif ($http_code === 400) {
        echo "- Invalid request format or credentials\n";
    } else {
        echo "- Unexpected error. Check your network connection\n";
    }
    
    exit(1);
}
