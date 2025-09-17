<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // چک کردن اینکه کاربر لاگین کرده
        if (!Auth::check()) {
            return response()->json(['error' => 'لطفاً ابتدا وارد شوید'], 401);
        }

        $user = Auth::user();

        // چک کردن سوپرادمین یا ادمین بودن
        if ($user->is_admin) {
            return $next($request);
        }

        return response()->json(['error' => 'شما دسترسی ادمین ندارید'], 403);
    }
}