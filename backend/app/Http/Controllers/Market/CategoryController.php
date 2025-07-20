<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\CategoryRequest;
use App\Models\Market\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
             $categories = Category::query()
            ->select('id', 'name')
            ->get();
            return response()->json($categories);

         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت محصولات رخ داد',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
         try {
            // ایجاد دسته‌بندی جدید
            $data=$request->only([
                'name',
                'parent_id',
            ]);

            $category = Category::create($data);

            // برگرداندن پاسخ با داده‌های دسته‌بندی
            return response()->json([
                'message' => 'دسته‌بندی با موفقیت اضافه شد',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در اضافه کردن دسته‌بندی رخ داد',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
         return response()->json([
            'id'=>$category->id,
            'name'=>$category->name,
            'parent_id'=>$category->parent_id,
         ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, Category $category)
    {
        try{
              $data=$request->only([
                'name',
                'parent_id',
            ]);
             $category->update($data);
             return response()->json(['message'=>'دسته بندی به روز رسانی شد']);

         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در ویرایش دسته‌بندی رخ داد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try{
             $category->delete();
                return response()->json([
               'message'=>'دسته بندی مورد نظر با موفقیت حذف شد'
             ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در حذف دسته‌بندی رخ داد',
            ], 500);
        }
    }
}
