<?php

namespace App\Models\Market;

use App\Models\Market\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['product_id', 'image', 'is_main'];

    protected $casts = [
        'is_main' => 'boolean'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
