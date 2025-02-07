<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

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
