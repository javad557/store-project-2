<?php

namespace App\Models\support;

use App\Models\support\CategoryTicket;
use App\Models\support\FileTicket;
use App\Models\support\PriorityTicket;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'category_id',
        'priority_id',
        'user_id',
        'title',
        'body',
        'parent_id',
        'seen',
        'status'
    ];

    protected $casts = [
        'status' => 'string',
        'seen' => 'boolean'
    ];
     public function categoryTicket()
    {
        return $this->belongsTo(CategoryTicket::class,'category_id');
    }

    public function priorityTicket()
    {
        return $this->belongsTo(PriorityTicket::class,'priority_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
     public function parent()
    {
        return $this->belongsTo(Ticket::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Ticket::class, 'parent_id');
    }

    public function files()
{
    return $this->hasMany(FileTicket::class);
}

public function hasUnseenDescendants()
{
    $hasUnseen = false;
    
    // جمع‌آوری همه فرزندان به‌صورت بازگشتی
    $checkChildren = function ($ticket) use (&$checkChildren, &$hasUnseen) {
        foreach ($ticket->children as $child) {
            if ($child->seen == 0) {
                $hasUnseen = true;
                return;
            }
            $checkChildren($child); // بررسی فرزندانِ فرزند
        }
    };
    
    $checkChildren($this);
    return $hasUnseen;
}



 public function getRootTicket()
    {
        $chekRoot = function ($ticket) use (&$chekRoot) {
            if ($ticket->parent_id && $ticket->parent) {
                return $chekRoot($ticket->parent);
            }
            return $ticket->exists ? $ticket : null;
        };

        return $chekRoot($this);
    }




}
