<?php
require_once __DIR__ . '/Config.php';

class JWTHelper {
    
    private static function getSecret() {
        return Config::get('JWT_SECRET');
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
    
    public static function encode($payload, $expiresIn = 86400) {
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiresIn;
        
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        
        $segments = [];
        $segments[] = self::base64UrlEncode(json_encode($header));
        $segments[] = self::base64UrlEncode(json_encode($payload));
        
        $signing_input = implode('.', $segments);
        $signature = hash_hmac('sha256', $signing_input, self::getSecret(), true);
        $segments[] = self::base64UrlEncode($signature);
        
        return implode('.', $segments);
    }
    
    public static function decode($jwt) {
        $segments = explode('.', $jwt);
        
        if (count($segments) !== 3) {
            return null;
        }
        
        list($header64, $payload64, $signature64) = $segments;
        
        $header = json_decode(self::base64UrlDecode($header64), true);
        $payload = json_decode(self::base64UrlDecode($payload64), true);
        
        // Verify signature
        $signing_input = $header64 . '.' . $payload64;
        $signature = self::base64UrlDecode($signature64);
        $expected_signature = hash_hmac('sha256', $signing_input, self::getSecret(), true);
        
        if ($signature !== $expected_signature) {
            return null;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
}
