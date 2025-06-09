<?php

namespace App\Models\PurchaseProcess;

use App\Models\PurchaseProcess\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryMethod extends Model
{
    use HasFactorySoftDeletes;

    protected $fillable = ['name', 'amount', 'delivery_time'];

    public function orders()
{
    return $this->hasMany(Order::class, 'delivery_id');
}
}
