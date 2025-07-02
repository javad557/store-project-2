<?php

namespace App\Models\Marketing;

use App\Models\Marketing\AnnouncementFile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['title', 'body', 'send_method', 'status', 'send_date'];

    protected $casts = [
        'send_method' => 'string',
        'status' => 'string'
    ];

    public function files()
    {
        return $this->hasMany(AnnouncementFile::class);
    }
}
