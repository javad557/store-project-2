<?php

namespace App\Models\Marketing;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommonDiscount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['occasion', 'amount', 'discount_ceiling', 'start_date', 'end_date'];
}
