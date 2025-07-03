<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\BrandRequest;
use App\Models\Market\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands=Brand::all();
        return response()->json($brands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BrandRequest $request)
    {
        try{
            $data=$request->only(['name']);
            Brand::create($data);
            return response()->json([
            'message'=>'برند مورد نظر با موفقیت افزوده شد'
        ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در اضافه کردن برند رخ داد',
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
            $data=$request->only(['name']);
            $brand->update($data);
            return response()->json([
            'message'=>'برند مورد نظر با موفقیت ویرایش شد'
        ]);
        }
        catch (\Exception $e) {
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
        try{
            $brand->delete();
            return response()->json([
            'message'=>'برند مورد نظر با موفقیت حذف شد'
        ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در حذف برند رخ داد',
            ], 500);
        }
    }
}
