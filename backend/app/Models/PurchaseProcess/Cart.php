<?php

namespace App\Models\PurchaseProcess;

use App\Models\Market\Variant;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['user_id', 'variant_id', 'number'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
