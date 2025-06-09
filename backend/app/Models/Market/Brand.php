<?php

namespace App\Models\Market;

use App\Models\Market\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory,SoftDeletes;

     protected $fillable = ['name'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
