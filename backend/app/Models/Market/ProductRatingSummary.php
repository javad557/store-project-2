<?php

namespace App\Models\Market;

use App\Models\Market\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductRatingSummary extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['product_id', 'totalrating', 'totalusers', 'averagescore'];

    protected $casts = [
        'averagescore' => 'decimal:2'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
