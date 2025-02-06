<?php

namespace App\Utils;

class DecryptUtil
{
    public static function decryptData($ciphertext)
    {
        $decodedData = base64_decode($ciphertext);
        return $decodedData;
    }
}
