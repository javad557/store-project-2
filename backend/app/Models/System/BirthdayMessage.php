<?php

namespace App\Models\system;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BirthdayMessage extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['body'];

}
