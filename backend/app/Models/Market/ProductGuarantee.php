<?php

namespace App\Models\Market;

use App\Models\Market\Guarantee;
use App\Models\Market\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductGuarantee extends Model
{
    use HasFactory,SoftDeletes;

    protected $table = 'product_guarantee';
    protected $fillable = ['product_id', 'guarantee_id', 'duration', 'price_increase'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function guarantee()
    {
        return $this->belongsTo(Guarantee::class);
    }
}
