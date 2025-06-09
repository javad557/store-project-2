<?php

namespace App\Models\Market;

use App\Models\Market\Product;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['product_id', 'user_id', 'price_increase', 'score'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
