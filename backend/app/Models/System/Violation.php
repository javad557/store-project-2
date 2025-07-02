<?php

namespace App\Models\system;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Violation extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['user_id', 'violation_type'];

    protected $casts = [
        'violation_type' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
