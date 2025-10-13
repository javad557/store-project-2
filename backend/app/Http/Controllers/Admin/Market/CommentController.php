<?php

namespace App\Http\Controllers\Admin\Market;

use App\Http\Controllers\Controller;
use App\Models\Market\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
{
    try {
        $query = Comment::with(['user', 'product'])->latest();
        // جستجو بر اساس محتوای نظر
        if ($request->has('search') && $request->search) {
            $query->where('body', 'like', '%' . $request->search . '%');
        }

        // فیلتر بر اساس وضعیت
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $comments = $query->get();
        Comment::where('seen', 0)->update(['seen' => 1]);

        // پاسخ با کلید data
        return response()->json([
            'data' => $comments
        ], 200);
    } catch (\Exception $e) {
        Log::error('خطا در دریافت نظرات: ' . $e->getMessage());
        return response()->json([
            'error' => 'خطایی در دریافت نظرات رخ داد',
        ], 500);
    }
}

       public function new_comments()
    {
        try {
            $new_comments = Comment::with(['user'])->where('seen',0)->get();
            return response()->json([
                'data'=>$new_comments
            ],200);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت نظرات: ' . $e->getMessage());
            return response()->json([
                'error' => 'خطایی در دریافت نظرات رخ داد',
            ], 500);
        }
    }


    public function changeStatus(Request $request,Comment $comment){
    try {
         $request->validate([
            'status' => ['required', 'integer', 'in:0,1,2'],
        ]);
            $comment->status=$request->status;
            $comment->save();
         return response()->json([
                'message'=>'کامنت مورد نظر با موفقیت برای ویرایش شد'
            ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'خطایی در تغییر وضعیت کامنت رخ داد: ' . $e->getMessage(),
        ], 500);
    }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
