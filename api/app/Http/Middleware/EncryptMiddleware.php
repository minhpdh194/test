<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use phpseclib3\Crypt\RSA;
use Symfony\Component\HttpFoundation\Response;

class EncryptMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $encryptedData = Crypt::encrypt(json_encode($response->getContent()));

        $response->setContent($encryptedData);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
