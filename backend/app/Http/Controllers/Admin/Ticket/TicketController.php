<?php

namespace App\Http\Controllers\Admin\Ticket;

use App\Http\Controllers\Controller;
use App\Models\support\Ticket;
use App\Models\system\ForbiddenWord;
use App\Models\system\Violation;
use Carbon\Carbon;
use Dotenv\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cache;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    try {
        $tickets = Ticket::with([
            'user',
            'categoryTicket',
            'priorityTicket',
        ])
            ->whereNull('parent_id')
            ->get()
            ->map(function ($ticket) {
                $ticket->has_unseen_child = $ticket->hasUnseenDescendants();
                return $ticket;
            });

        return response()->json([
            'data' => $tickets,
            'message' => 'تیکت‌ها با موفقیت دریافت شد',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'دریافت تیکت‌های مورد نظر با خطا مواجه شد'
        ], 500);
    }
}


    public function change_status(Ticket $ticket){
        try{
            $ticket->status='closed';
            $ticket->save();
            return response()->json([
                'message'=>'تغییر وضعیت با موفقیت انجام شد',
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'تغییر وضعیت تیکت مورد نظر با خطا مواجه شد'
            ],500);
        }
    }



     public function get_related_tickets(Ticket $ticket)
{
    // Log::info('allticketstest',['allticketstest'=>'yes']);
   try {
        $user = Auth::guard('api')->user();
        if (!$user) {
            return response()->json(['error' => 'ابتدا وارد حساب کاربری شوید.'], 401);
        }

        $id=$ticket->id;
        $mainTicket = Ticket::findOrFail($id);

        // گرفتن همه id های مرتبط (خود تیکت + همه فرزندان در هر عمق)
        $ids = $mainTicket->getAllDescendantIds(); // آرایه از idها

        // واکشی همه تیکت‌ها با eager load روابط (این query یک Eloquent\Collection برمی‌گرداند)
        $tickets = Ticket::with(['user', 'categoryTicket', 'priorityTicket'])
            ->whereIn('id', $ids)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'data' => [
                'tickets' => $tickets,
                'current_user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                ]
            ],
            'message' => 'تیکت‌ها با موفقیت دریافت شدند',
        ], 200);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['error' => 'تیکت مورد نظر یافت نشد'], 404);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json(['error' => 'خطا در دریافت تیکت‌ها'], 500);
    }
}

    public function new_tickets()
{
     // احراز هویت کاربر از JWT
            if (!Auth::guard('api')->check()) {
                return response()->json([
                    'error' => 'احراز هویت کاربر مورد نیاز است. لطفاً توکن معتبر ارسال کنید.',
                ], 401);
            }

            $user = Auth::guard('api')->user();
    Log::info('check',['check'=>'yes']);
    try {
        $new_tickets = Ticket::with([
            'user',
            'categoryTicket',
            'priorityTicket',
        ])
            ->where('seen', 0)
            ->where('user_id','!=',$user->id)
            ->get()
            ->map(function ($ticket) {
                $rootTicket = $ticket->getRootTicket();
                $ticket->root_parent = $rootTicket ? [
                    'id' => $rootTicket->id,
                    'title' => $rootTicket->title,
                ] : null;
                return $ticket;
            });

        return response()->json([
            'data' => $new_tickets,
            'message' => 'تیکت‌ها با موفقیت دریافت شد',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'دریافت تیکت‌های مورد نظر با خطا مواجه شد'
        ], 500);
    }
}
    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
        Log::info('tickettest',['tickettest'=>'yes']);
        try {
            // احراز هویت کاربر از JWT
            if (!Auth::guard('api')->check()) {
                return response()->json([
                    'error' => 'احراز هویت کاربر مورد نیاز است. لطفاً توکن معتبر ارسال کنید.',
                ], 401);
            }

            $user = Auth::guard('api')->user();

            // Validation درخواست (اختیاری، اما توصیه‌شده)
            $request->validate([
                'title' => 'required|string|max:255',
                'body' => 'required|string',
                'parent_id' => 'nullable|integer|exists:tickets,id',
                'category_id' => 'required|integer|exists:category_tickets,id',
                'priority_id' => 'required|integer|exists:priority_tickets,id',
            ]);

            $body = strtolower(trim($request->body)); // lowercase و trim برای چک

            // چک forbidden words با Eloquent (از مدل ForbiddenWord)
            $badWords = Cache::remember('forbidden_words_list', 3600, function () { // cache ۱ ساعته
                return ForbiddenWord::pluck('word')->map(fn($word) => strtolower($word))->toArray();
            });

            $hasBadWord = false;
            foreach ($badWords as $word) {
                if (stripos($body, $word) !== false) { // case-insensitive partial match (word در body)
                    $hasBadWord = true;
                    Log::info('Bad word detected', ['word' => $word, 'body_snippet' => substr($body, 0, 50)]);
                    break; // اولین match کافیه
                }
            }

            if ($hasBadWord) {
                // ثبت violation با type 'insult'
                Violation::create([
                    'user_id' => $user->id,
                    'violation_type' => 'insult',
                ]);

                // شمارش تعداد violations کاربر
                $violationCount = Violation::where('user_id', $user->id)->count();

                if ($violationCount > 15) {
                    // بلاک کاربر به مدت 1 هفته
                    $user->update([
                        'is_blocked' => true,
                        'blocked_until' => Carbon::now()->addWeek(),
                    ]);

                    Log::warning('User blocked due to violations', [
                        'user_id' => $user->id,
                        'violation_count' => $violationCount,
                    ]);

                    try {
                        $token = JWTAuth::getToken();
                        if ($token) {
                            JWTAuth::invalidate($token); // token رو blacklist کن
                            Log::info('Token invalidated due to block', ['user_id' => $user->id]);
                        }
                    } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
                        Log::warning('Token invalidate failed', ['error' => $e->getMessage(), 'user_id' => $user->id]);
                    }

                    return response()->json([
                        'error' => 'متاسفانه به دلیل تخلفات زیاد حساب کاربری شما به مدت یک هفته مسدود شده است',
                    ], 401);
                }

                // اگر <=5، violation ثبت شد اما تیکت ذخیره نشه
                Log::warning('Insult violation logged', [
                    'user_id' => $user->id,
                    'body_snippet' => substr($body, 0, 50) . '...',
                ]);

                return response()->json([
                    'error' => 'محتوای نامناسب شامل کلمات ممنوعه است. لطفاً متن را اصلاح کنید.',
                ], 422);
            }

            // اگر همه چیز OK، تیکت رو ذخیره کن
            $ticket = Ticket::create([
                'title' => $request->title,
                'body' => $request->body,
                'parent_id' => $request->parent_id,
                'category_id' => $request->category_id,
                'priority_id' => $request->priority_id,
                'user_id' => $user->id, // از JWT
            ]);

            Log::info('Ticket created successfully', [
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => 'تیکت مورد نظر با موفقیت افزوده شد',
                'data' => $ticket, // اختیاری: تیکت جدید رو برگردون
            ], 201); // 201 برای create

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'داده‌های ورودی نامعتبر است: ' . $e->getMessage(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error('Ticket creation failed', [
                'error' => $e->getMessage(),
                'user_id' => $user->id ?? 'unknown',
            ]);
            return response()->json([
                'error' => 'افزودن تیکت مورد نظر موفقیت آمیز نبود',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        try{
            return response()->json([
                'data'=>$ticket,
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'تیکت مورد نظر دریافت نشد',
            ],500);
        }
    }



   public function mark_tickets_as_seen(Request $request)
    {
        // اعتبارسنجی ورودی
         $request->validate([
            'ticketIds' => 'required|array',
            'ticketIds.*' => 'required|integer|exists:tickets,id', // اطمینان از وجود IDها
         ]);

        // دریافت آرایه ticketIds
        $ticketIds = $request->input('ticketIds');

         if (!Auth::guard('api')->check()) {
            return response()->json([
                'error' => 'لطفاً ابتدا وارد حساب کاربری خود شوید',
            ], 401);
        }
        $user = Auth::guard('api')->user();

        try {
            // به‌روزرسانی تیکت‌های unseen به seen
            Ticket::whereIn('id', $ticketIds)
                ->where('seen', false)->where('user_id','!=',$user->id) // فقط تیکت‌های unseen
                ->update(['seen' => true]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطا در به‌روزرسانی تیکت‌ها: ' . $e->getMessage(),
            ], 500);
        }
    }

}
