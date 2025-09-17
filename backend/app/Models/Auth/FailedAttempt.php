<?php

namespace App\Models\Auth;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FailedAttempt extends Model
{
    use HasFactory;

     protected $fillable = ['user_id','attempt_type'];
}
