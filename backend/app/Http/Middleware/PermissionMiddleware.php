<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PermissionMiddleware
{
    public function handle(Request $request, Closure $next, $permission)
    {
        // چک کردن اینکه کاربر لاگین کرده
        if (!Auth::check()) {
            return response()->json(['error' => 'لطفاً ابتدا وارد شوید'], 401);
        }

        $user = Auth::user();

        

        // اگه کاربر سوپرادمینه، نیازی به چک کردن دسترسی نیست
        if ($user->hasRole('super_admin')) {
          
            return $next($request);
          
        }

        

        // چک کردن دسترسی خاص
        if (!$user->hasPermission($permission)) {
       
            return response()->json(['error' => 'شما مجوز لازم برای این عملیات را ندارید'], 403);
        }

        return $next($request);
    }
}