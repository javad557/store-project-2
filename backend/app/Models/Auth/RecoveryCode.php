<?php

namespace App\Models\Auth;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecoveryCode extends Model
{
    use HasFactory;

     protected $fillable = ['user_id', 'code', 'is_uesed'];

    protected $casts = [
        'is_uesed' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public $timestamps = ['created_at'];
}
