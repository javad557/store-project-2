<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'ip ', 'system_info','attempt_count','incorrect_otp'
    ,'incorrect_2fa','is_failed','block_start_at'];
}
