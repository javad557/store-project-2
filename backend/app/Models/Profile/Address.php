<?php

namespace App\Models\Profile;

use App\Models\Profile\City;
use App\Models\Profile\Province;
use App\Models\PurchaseProcess\Order;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['user_id','address', 'postal_code', 'no', 'unit', 'mobile', 'city_id', 'province_id', 'price_increase'];

     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function orders()
{
    return $this->hasMany(Order::class);
}
}
