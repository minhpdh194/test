<?php

namespace App\Http\Middleware;

use App\Utils\DecryptUtil;
use App\Utils\EncryptUtil;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use phpseclib3\Crypt\RSA;
use Symfony\Component\HttpFoundation\Response;

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
            $encryptedPayload = $request[0];
            list($headerEncoded, $payloadEncoded) = explode('.', $encryptedPayload);
            $header = json_decode(base64_decode($headerEncoded), true);
            $payload = json_decode(base64_decode($payloadEncoded), true);
            $request->replace($payload);
        }

        return $next($request);
    }
}
