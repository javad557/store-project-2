<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Marketing\BannerRequest;
use App\Models\Marketing\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $authHeader = $request->header('Authorization', 'هدر Authorization ارسال نشده');
        Log::info('Authorization Header', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'authorization' => $authHeader,
        ]);
        try{
             $banners = Banner::all();
            return response()->json($banners);

         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت بنرها رخ داد',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BannerRequest $request)
    {
        try{

            $imegePath=$request->file('image')->store('images/banners','public');
            Banner::create([
                'title'=>$request->title,
                'url'=>$request->url,
                'image'=>$imegePath,
                'position'=>$request->position,
            ]);

            return response()->json([
                'message'=>'بنر مورد نظر با موفقیت به سایت افزوده شد'
            ]);
            
        } catch (\Exception $e) {
            Log::error('خطا در ذخیره بنر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ذخیره بنر'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
          try{
            return response()->json($banner);
            
        } catch (\Exception $e) {
            Log::error('خطا در ارسال بنر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ذخیره بنر'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BannerRequest $request, Banner $banner)
    {
          try {
             $data = [
                'title' => $request->title,
                'url' => $request->url,
                'position' => $request->position,
            ];
            // حذف تصویر بنر از ذخیره‌ساز اگر وجود داشته باشد
            if ($request->hasFile('image')) {
                 if ($banner->image) {
                    Storage::disk('public')->delete($banner->image);
                }
                 $data['image']=$request->file('image')->store('images/banners','public');
            }
           
            $banner->update($data);

            return response()->json([
                'message'=>'بنر مورد نظر با موفقیت به ویرایش شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در ویرایش بنر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ویرایش بنر'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
         try {
            // حذف تصویر بنر از ذخیره‌ساز اگر وجود داشته باشد
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            // حذف بنر از دیتابیس
            $banner->delete();
            return response()->json(['message' => 'بنر با موفقیت حذف شد'], 200);
        } catch (\Exception $e) {
            Log::error('خطا در حذف بنر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در حذف بنر'], 500);
        }
    }
}
