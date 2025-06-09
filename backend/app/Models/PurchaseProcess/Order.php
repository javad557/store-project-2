<?php

namespace App\Models\PurchaseProcess;

use App\Models\Profile\Address;
use App\Models\PurchaseProcess\OrderItem;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'user_id',
        'amount_price',
        'amount_discount',
        'finall_amount_price',
        'status',
        'order_registration_date',
        'order_payment_date',
        'processing_date',
        'sent_date',
        'delivery_date',
        'tracking_code',
        'address_id',
        'payment_id',
        'delivery_id',
        'payment_code'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
