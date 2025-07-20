<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;

class DebugRequest
{
    public function handle($request, Closure $next)
    {
        Log::info('هدرهای درخواست:', $request->headers->all());
        Log::info('بدنه خام درخواست:', ['input' => file_get_contents('php://input')]);
        Log::info('Content-Type دریافتی:', [$request->header('Content-Type')]);
        Log::info('Accept دریافتی:', [$request->header('Accept')]);
        return $next($request);
    }
}