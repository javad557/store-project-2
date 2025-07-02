<?php

namespace App\Models\Market;

use App\Models\Market\Variant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductColor extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['name', 'code', 'hax'];

    public function variants()
{
    return $this->hasMany(Variant::class, 'color_id');
}
}
