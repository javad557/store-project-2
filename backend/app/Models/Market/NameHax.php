<?php

namespace App\Models\Market;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NameHax extends Model
{
    use HasFactory;
    protected $table = 'name_hax';
     protected $fillable = ['name', 'hax'];

    public $timestamps = false;
}
