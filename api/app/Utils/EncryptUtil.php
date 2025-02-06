<?php

namespace App\Utils;

class EncryptUtil
{
    public static function encryptData($data)
    {
        $encryptionKey = env('APP_KEY');
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt(json_encode($data), 'AES-256-CBC', $encryptionKey, 0, $iv);
        return base64_encode($iv . $encrypted);
    }
}
