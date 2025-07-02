<?php

namespace App\Models\Marketing;

use App\Models\Market\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Amazing extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['product_id', 'amout', 'end_date', 'status'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
