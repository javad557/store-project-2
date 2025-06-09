<?php

namespace App\Models\Marketing;

use App\Models\Marketing\Announcement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementFile extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['announcement_id', 'file_path'];

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}
