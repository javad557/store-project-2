<?php

namespace App\Models\Market;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CodeHax extends Model
{
    use HasFactory;
    protected $fillable = ['code', 'hax'];

    public $timestamps = false;
}
