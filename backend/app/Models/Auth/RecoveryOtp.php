<?php

namespace App\Models\Auth;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecoveryOtp extends Model
{
    use HasFactory;

      protected $fillable = ['user_id', 'token', 'used'];

    protected $casts = [
        'used' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
