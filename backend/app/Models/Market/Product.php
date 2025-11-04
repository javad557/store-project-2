<?php

namespace App\Models\Market;

use App\Models\Market\Brand;
use App\Models\Market\Category;
use App\Models\Market\Comment;
use App\Models\Market\Gallery;
use App\Models\Market\Guarantee;
use App\Models\Market\ProductRatingSummary;
use App\Models\Market\Rating;
use App\Models\Market\Variant;
use App\Models\Marketing\Amazing;
use App\Models\Profile\Favorite;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'price',
        'description',
        'marketable',
        'published_at',
        'sold_number',
        'view_number',
        'score'
    ];

     public function guarantees()
    {
        return $this->belongsToMany(Guarantee::class, 'product_guarantee')
                    ->withPivot('duration', 'price_increase')
                    ->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function favorites()
{
    return $this->hasMany(Favorite::class);
}

public function variants()
{
    return $this->hasMany(Variant::class);
}

public function amazings()
{
    return $this->hasMany(Amazing::class);
}

public function gallery()
{
    return $this->hasMany(Gallery::class);
}

public function comments()
{
    return $this->hasMany(Comment::class);
}

public function ratings()
{
    return $this->hasMany(Rating::class);
}

public function ratingSummary()
{
    return $this->hasOne(ProductRatingSummary::class);
}

 public function mainImage()
    {
        return $this->hasOne(Gallery::class)->where('is_main', 1);
    }
}
