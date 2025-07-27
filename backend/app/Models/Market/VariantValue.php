<?php

namespace App\Models\Market;

use App\Models\Market\ProductAttribute;
use App\Models\Market\ProductAttributeValue;
use App\Models\Market\Variant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VariantValue extends Model
{
    use HasFactory;

    protected $fillable = ['variant_id', 'attribute', 'value'];

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function productAttribute()
    {
        return $this->belongsTo(ProductAttribute::class);
    }

    public function productAttributeValue()
    {
        return $this->belongsTo(ProductAttributeValue::class);
    }
}
