<?php

namespace App\Models\Market;

use App\Models\Market\ProductAttributeValue;
use App\Models\Market\VariantValue;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function values()
    {
        return $this->hasMany(ProductAttributeValue::class);
    }

    public function variants()
    {
        return $this->hasMany(VariantValue::class);
    }
}
