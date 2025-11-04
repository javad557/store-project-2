<?php

namespace App\Models\support;

use App\Models\support\CategoryTicket;
use App\Models\support\FileTicket;
use App\Models\support\PriorityTicket;
use App\Models\User\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

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
    $currentUser = Auth::guard('api')->user(); // دریافت کاربر فعلی

    if (!$currentUser) {
        return false; // اگر کاربری لاگین نکرده، false برگردون
    }

    $currentUserId = $currentUser->id;

    // جمع‌آوری همه فرزندان به‌صورت بازگشتی
    $checkChildren = function ($ticket) use (&$checkChildren, &$hasUnseen, $currentUserId) {
        foreach ($ticket->children as $child) {
            // فقط تیکت‌هایی که seen = 0 و توسط کاربر فعلی نوشته نشده‌اند
            if ($child->seen == 0 && $child->user_id != $currentUserId) {
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


    public function getAllDescendantIds(): array
    {
        $ids = [];
        $stack = [$this->id];

        while (!empty($stack)) {
            $parentId = array_pop($stack);

            // اضافه کردن parent به لیست (در نهایت خود تیکت اصلی هم خواهد بود)
            if (!in_array($parentId, $ids)) {
                $ids[] = $parentId;
            }

            // گرفتن فرزندان مستقیم آن parent
            $children = self::where('parent_id', $parentId)->pluck('id')->toArray();

            foreach ($children as $childId) {
                if (!in_array($childId, $ids)) {
                    $stack[] = $childId;
                }
            }
        }

        return $ids;
    }



}
