<?php

namespace App\Models\support;

use App\Models\support\Ticket;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FileTicket extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['ticket_id', 'file_path'];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
