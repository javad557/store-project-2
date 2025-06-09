<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['image', 'url', 'title', 'position'];
}
