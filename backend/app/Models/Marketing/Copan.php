<?php

namespace App\Models\Marketing;

use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Copan extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['user_id', 'code', 'amount', 'used', 'end_date', 'status'];

    protected $casts = [
        'used' => 'boolean',
        'status' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
