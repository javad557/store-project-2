<?php

namespace App\Models\PurchaseProcess;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['name'];
}
