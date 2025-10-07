<?php

namespace App\Models\system;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ForbiddenWord extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['word'];

    protected $table = 'forbidden_words';
}
