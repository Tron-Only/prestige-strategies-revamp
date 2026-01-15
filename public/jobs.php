<?php
// jobs.php
// This script handles the CV upload and sends it as an email attachment.

// IMPORTANT:
// 1. Place this file in the root of your public-facing directory (e.g., public_html, www, or your Vite project's `public` folder if the server is configured to serve it).
// 2. This script is a basic example and lacks robust security features. For a production environment, consider adding more validation and security measures.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['cv']) && isset($_POST['jobTitle']) && isset($_POST['companyemail'])) {
        $jobTitle = $_POST['jobTitle'];
        $companyEmail = $_POST['companyemail'];
        $file = $_FILES['cv'];

        // File validation
        $allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        $fileType = mime_content_type($file['tmp_name']);

        if (!in_array($fileType, $allowedTypes)) {
            http_response_code(400);
            echo "Invalid file type. Please upload a PDF, DOC, or DOCX file.";
            exit;
        }

        // Email configuration
        $to = $companyEmail;
        $from = "vivianperose@prestigestrategies.co.ke"; // Replace with a valid email address from your domain
        $subject = "New CV Submission for " . $jobTitle;

        // Email message
        $message = "A new CV has been submitted for the position of " . $jobTitle . ".";

        // Attachment
        $attachment = chunk_split(base64_encode(file_get_contents($file['tmp_name'])));
        $filename = $file['name'];

        // Headers
        $boundary = md5(time());
        $headers = "From: " . $from . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

        // Body
        $body = "--" . $boundary . "\r\n";
        $body .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $message . "\r\n";
        $body .= "--" . $boundary . "\r\n";
        $body .= "Content-Type: " . $fileType . "; name=\"" . $filename . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= "Content-Disposition: attachment; filename=\"" . $filename . "\"\r\n\r\n";
        $body .= $attachment . "\r\n";
        $body .= "--" . $boundary . "--";

        // Send email
        if (mail($to, $subject, $body, $headers)) {
            echo "CV uploaded successfully.";
        } else {
            http_response_code(500);
            echo "Failed to send email.";
        }
    } else {
        http_response_code(400);
        echo "Missing required fields.";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed.";
}
?>
