<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\system\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoginRegisterManagmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $authHeader = $request->header('Authorization', 'هدر Authorization ارسال نشده');
        Log::info('Authorization Header', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'authorization' => $authHeader,
        ]);
        // Log::info('test',['loginregistermanagmenttest'=>'yes']);
        try{
            $setting=Setting::first();
            return response()->json($setting);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت تنظیمات لاگین رجیستر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در تنظیمات لاگین رجیستر'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $loginregistermanagment)
    {
        //  Log::info('test',['updateloginregistermanagmenttest'=>$request->all()]);
         try{
            $loginregistermanagment->update([
                'login_page_description'=>$request->login_page_description,
                'too_many_attempts_error'=>$request->too_many_attempts_error,
                'max_attempts_per_identifier'=>$request->max_attempts_per_identifier,
                'attempt_window_hours'=>$request->attempt_window_hours,
                'max_otpand2fa_attempts'=>$request->max_otpand2fa_attempts,
                'otpand2fa_attempt_window_hours'=>$request->otpand2fa_attempt_window_hours,
                'otp_error_message'=>$request->otp_error_message,
                'block_error_message'=>$request->block_error_message,
                'otpand2fa_block_duration_hours'=>$request->otpand2fa_block_duration_hours,
                'otp_expiry_minutes'=>$request->otp_expiry_minutes,
                'otp_page_description'=>$request->otp_page_description,
                'one_time_password_page_description'=>$request->one_time_password_page_description,
                'one_time_password_count'=>$request->one_time_password_count,
                'max_successful_otp_attempts'=>$request->max_successful_otp_attempts,
                'successful_otp_window_hours'=>$request->successful_otp_window_hours,
                'too_many_successful_logins_error'=>$request->too_many_successful_logins_error,
                'twofa_page_description'=>$request->twofa_page_description,
                'twofa_error_message'=>$request->twofa_error_message,
            ]);
            return response()->json([
                'message'=>'تغیرات لاگین رجیستر با موفقیت اعمال شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در اعمال تنظیمات لاگین رجیستر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در اعمال تنظیمات لاگین رجیستر'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
