<?php

namespace App\Http\Controllers\Admin\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Market\BrandRequest;
use App\Models\Market\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       try{
        $brands = Brand::all();
        return response()->json([
            'data'=>$brands,
        ],200);
       }
       catch(\Throwable $e){
        Log::error($e->getMessage());
        return response()->json([
            'error'=>'دریافت برندهای مورد نظر با خطا مواجه شد',
        ],500);
       }
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(BrandRequest $request)
{
    Log::alert('test',['storetest'=>$request->name]);
    try {
        $brand = Brand::create([
            'name'=>$request->name,
        ]);
        return response()->json([
            'message' => 'برند مورد نظر با موفقیت افزوده شد',
            'brand' => $brand // اضافه کردن داده‌های برند
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'خطایی در اضافه کردن برند رخ داد',
            'exception' => $e->getMessage() // برای دیباگ
        ], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
          return response()->json([
            'id'=>$brand->id,
            'name'=>$brand->name,
         ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BrandRequest $request, Brand $brand)
    {
        try{
            $brand->update([
                'name'=>$request->name,
            ]);
            return response()->json([
            'message'=>'برند مورد نظر با موفقیت ویرایش شد',
            'brand' => $brand // اضافه کردن داده‌های برند
        ],200);
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'خطایی در ویرایش برند رخ داد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        Log::info('test',['deletetest'=>'yes']);
        try{
            $brand->delete();
            return response()->json([
            'message'=>'برند مورد نظر با موفقیت حذف شد'
        ]);
        }
        catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'خطایی در حذف برند رخ داد',
            ], 500);
        }
    }
}
