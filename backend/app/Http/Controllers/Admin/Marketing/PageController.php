<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Marketing\PageRequest;
use App\Models\Marketing\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Log::info('test',['testpages'=>'yes']);
        try{
            $pages = Page::all();
            return response()->json([
                'data'=>$pages,
                'message'=>'صفحات اطلاع رسانی با موفقیت دریافت شدند',
            ],200);
        }
        catch(\Throwable $e){
            Log::error('خطا در سمت سرور: ' . $e->getMessage());
            return response()->json([
                'error'=>'خطا در سمت سرور'
            ],500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PageRequest $request)
    {
        // Log::info('posttest',['posttest'=>$request->all()]);
        try{
            Page::create([
                'title'=>$request->title,
                'body'=>$request->body,
            ]);
            return response()->json([
                'message'=>'صفحه اطلاع رسانی مورد نظر با موفقیت افزوده شد',
            ],200);
        }
        catch(\Throwable  $e){
            Log::error('خطا در افزودن صفحه اطلاع رسانی: ' . $e->getMessage());
            return response()->json([
                'error'=>'خطای سمت سرور',
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        try{
            return response()->json([
                'data'=>$page
            ],200);
        }
        catch(\Throwable $e){
            Log::error('خطا در دریافت روش صفحه اطلاع رسانی مورد نظر: ' . $e->getMessage());
            return response()->json([
                'error'=>'خطا در دریافت روش صفحه اطلاع رسانی مورد نظر ',
            ],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PageRequest $request, Page $page)
    {
        // Log::info('test',['updatetest'=>$request->all()]);
        try{
            $page->update([
                'title'=>$request->title,
                'body'=>$request->body,
            ]);
            return response()->json([
                'message'=>'صفحه اطلاع رسانی مورد نظر با موفقیت ویرایش شد',
            ],200);
        }
        catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'خطا در بروز رسانی صفحه اطلاع رسانی مورد نظر',
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        try{
            $page->delete();
            return response()->json([
                'message'=>'صفحه اطلاع رسانی با موفقیت حذف شد',
            ],200);
        }
        catch(\Throwable $e){
            Log::error('خطا در حذف روش مورد نظر: ' . $e->getMessage());
            return response()->json([
                'error'=>'خطا در سمت سرور صفحه اطلاع رسانی'
            ],500);
        }
    }



     // متد جدید برای تغییر وضعیت
    public function updateStatus(Request $request, Page $page)
    {
        try {
            // اعتبارسنجی ورودی
            $request->validate([
                'status' => 'required|in:0,1', // فقط 0 یا 1 مجاز است
            ]);

            // به‌روزرسانی وضعیت
            $page->status = $request->input('status');
            $page->save();

            return response()->json([
                'data' => $page,
                'message' => 'وضعیت صفحه با موفقیت تغییر کرد',
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('صفحه یافت نشد: ' . $e->getMessage());
            return response()->json([
                'error' => 'صفحه موردنظر یافت نشد'
            ], 404);
        } catch (\Throwable $e) {
            Log::error('خطا در تغییر وضعیت صفحه: ' . $e->getMessage());
            return response()->json([
                'error' => 'خطا در تغییر وضعیت صفحه'
            ], 500);
        }
    }
}
