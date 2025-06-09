<?php

namespace App\Models\Market;

use App\Models\Market\ProductAttribute;
use App\Models\Market\VariantValue;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttributeValue extends Model
{
    use HasFactory;
     protected $fillable = ['product_attribute_id', 'value'];

    public function productAttribute()
    {
        return $this->belongsTo(ProductAttribute::class);
    }

    public function variants()
    {
        return $this->hasMany(VariantValue::class);
    }
}
