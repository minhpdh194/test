<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\SetCacheHeaders;

use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

use App\Http\Middleware\DecryptMiddleware;
use App\Http\Middleware\EncryptMiddleware;

class CustomHeaders extends SetCacheHeaders
{
    public function handle($request, Closure $next, $options = [])
    {
        $response = $next($request);

        if ($request->isMethod('OPTIONS')) {
            return response('', 204)
                ->header('Access-Control-Allow-Origin', '*')
                ->header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,OPTIONS,DELETE')
                ->header('Access-Control-Allow-Headers', 'X-Requested-With,Origin,Content-Type,Authorization,Content-Range,Content-Disposition,Content-Description,X-Auth-Token');
        }

        return $response->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,OPTIONS,DELETE')
            ->header('Access-Control-Allow-Headers', 'X-Requested-With, Origin,Content-Type,Authorization,Content-Range,Content-Disposition,Content-Description,X-Auth-Token');
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'cache.headers' => CustomHeaders::class,
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'encrypt.response' => EncryptMiddleware::class,
            'decrypt.request' => DecryptMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
