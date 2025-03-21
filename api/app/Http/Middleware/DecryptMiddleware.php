<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use phpseclib3\Crypt\AES;
use phpseclib3\Crypt\RSA;

class DecryptMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->isMethod('get')) {
            // $encryptedPayload = $request[0];
            // list($headerEncoded, $payloadEncoded) = explode('.', $encryptedPayload);
            // $header = json_decode(base64_decode($headerEncoded), true);
            // $payload = json_decode(base64_decode($payloadEncoded), true);
            // $request->replace($payload);
            $encryptedAESKey = base64_decode($request->input('encryptedAESKey')); // RSA-encrypted AES key
            $iv = base64_decode($request->input('iv')); // IV in Base64
            $encryptedData = base64_decode($request->input('encryptedData')); // AES-encrypted data

            $privateKey = openssl_pkey_get_private(env("PRIVATE_KEY"));
            if (!$privateKey) {
                throw new \Exception("Invalid private key");
            }

            $aesKey = null;
            openssl_private_decrypt($encryptedAESKey, $aesKey, $privateKey);
            if (!$aesKey) {
                throw new \Exception("AES key decryption failed");
            }

            $aesKey = base64_decode($aesKey);

            $aes = new AES('cbc');
            $aes->setKey($aesKey);
            $aes->setIV($iv);
            $decryptedData = $aes->decrypt($encryptedData);

            $payload = json_decode($decryptedData, true);
            $request->replace($payload);
        }

        return $next($request);
    }
}
