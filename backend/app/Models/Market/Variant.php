<?php

namespace App\Models\Market;

use App\Models\Market\Product;
use App\Models\Market\ProductColor;
use App\Models\Market\VariantValue;
use App\Models\Profile\Comparison;
use App\Models\PurchaseProcess\Cart;
use App\Models\PurchaseProcess\OrderItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Variant extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['product_id', 'color_id', 'price_increase', 'number', 'freezed_number'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function color()
    {
        return $this->belongsTo(ProductColor::class, 'color_id');
    }

    public function values()
    {
        return $this->hasMany(VariantValue::class);
    }

    public function carts()
{
    return $this->hasMany(Cart::class);
}

public function orderItems()
{
    return $this->hasMany(OrderItem::class);
}

public function comparisons()
{
    return $this->hasMany(Comparison::class);
}
}
