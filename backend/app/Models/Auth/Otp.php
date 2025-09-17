<?php

namespace App\Models\Auth;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

     protected $fillable = ['user_id', 'otp_hash', 'used','expires_at','token'];

    protected $casts = [
        'used' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public $timestamps = ['created_at'];
}
