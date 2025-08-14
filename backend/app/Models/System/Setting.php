<?php

namespace App\Models\system;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;
    protected $fillable = ['login_page_description', 'too_many_attempts_error', 'max_attempts_per_identifier',
     'attempt_window_hours','max_otpand2fa_attempts','otpand2fa_attempt_window_hours','otp_error_message',
    'block_error_message','otpand2fa_block_duration_hours','otp_expiry_minutes','otp_page_description',
    'one_time_password_page_description','one_time_password_count','otp_retry_delay_seconds',
    'max_successful_otp_attempts','successful_otp_window_hours','too_many_successful_logins_error',
    'twofa_page_description','twofa_error_message'];

    public $timestamps = ['updated_at'];
}
