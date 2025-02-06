<?php

namespace App\Http\Middleware;

use App\Utils\DecryptUtil;
use App\Utils\EncryptUtil;
use Closure;
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
        $encryptedData = $request[0];
        if ($encryptedData) {
            try {
                $decryptedData = DecryptUtil::decryptData($encryptedData);
                $data = json_decode($decryptedData, true);
                $request->replace($data);
            } catch (\Exception $e) {
                \Log::error('Decryption failed: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}
