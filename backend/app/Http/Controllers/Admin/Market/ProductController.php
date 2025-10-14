<?php

namespace App\Http\Controllers\Admin\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Market\ProductRequest;
use App\Models\Market\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index(): JsonResponse
{
    Log::info('test',['productstest'=>'yes']);
    try {
        $products = Product::query()
            ->select('id', 'name', 'category_id', 'brand_id', 'price', 'marketable')
            ->with(['gallery' => function ($query) {
                $query->where('is_main', 1)->select('product_id', 'image');
            }])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category_id' => $product->category_id,
                    'brand_id' => $product->brand_id,
                    'price' => $product->price,
                    'marketable' => $product->marketable,
                    'main_image' => $product->gallery->isNotEmpty() ? $product->gallery->first()->image : null,
                ];
            });

        // Log::info('محصولات', ['محصولات' => $products->toArray()]);

        return response()->json([
            'data' => $products
        ], 200);
    } catch (\Exception $e) {
        Log::error('خطا در دریافت محصولات', ['error' => $e->getMessage()]);
        return response()->json([
            'error' => 'خطایی در دریافت محصولات رخ داد: ' . $e->getMessage(),
        ], 500);
    }
}
    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        try{
             $data=$request->only([
            'name',
            'category_id',
            'brand_id',
            'price',
            'description',
            'marketable',
            'published_at',
        ]);


        Product::create($data);
        return response()->json([
            'message'=>'محصول مورد نظر با موفقیت افزوده شد'
        ]);
         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در افزودن محصول رخ داد',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        Log::info('test',['showtest'=>'yes']);
        try{
            return response()->json([
                'data'=>$product
            ],200);
           
         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت محصول رخ داد',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, Product $product)
    {
        try{
             $data=$request->only([
            'name',
            'category_id',
            'brand_id',
            'price',
            'description',
            'marketable',
            'published_at',
        ]);


        $product->update($data);
        return response()->json([
            'message'=>'محصول مورد نظر با موفقیت ویرایش شد'
        ]);
         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در ویرایش محصول رخ داد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
public function destroy(Product $product)
{
    try {
        // بررسی وجود واریانت با سفارش فعال
        $hasActiveOrder = $product->variants()->where('freezed_number', '>', 0)->exists();

        if ($hasActiveOrder) {
            return response()->json([
                'error' => 'برای حداقل یکی از واریانت‌های محصول فوق سفارش فعال وجود دارد'
            ], 400);
        }

        // شروع تراکنش برای اطمینان از اتمی بودن عملیات
        DB::beginTransaction();

        // حذف نرم رکوردهای مرتبط با محصول
        // حذف کامنت‌ها
        $product->comments()->delete();

        // حذف امتیازات
        $product->ratings()->delete();

        // حذف تصاویر گالری
        $product->gallery()->delete();

        // حذف پیشنهادهای شگفت‌انگیز
        $product->amazings()->delete();

        // حذف علاقه‌مندی‌ها
        $product->favorites()->delete();

        // حذف رکوردهای رابطه چند به چند با گارانتی‌ها
        $product->guarantees()->detach();

        // حذف نرم رکوردهای مرتبط با واریانت‌ها
        foreach ($product->variants as $variant) {
            // حذف نرم رکوردهای variant_values
            $variant->values()->delete();

            // حذف نرم رکوردهای carts
            $variant->carts()->delete();

            // حذف نرم رکوردهای order_items
            $variant->orderItems()->delete();

            // حذف نرم رکوردهای comparisons
            $variant->comparisons()->delete();

            // حذف نرم خود واریانت
            $variant->delete();
        }

        // حذف نرم محصول
        $product->delete();

        // کامیت تراکنش
        DB::commit();

        return response()->json([
            'message' => 'محصول مورد نظر با موفقیت حذف شد'
        ]);

    } catch (\Exception $e) {
        // رول‌بک تراکنش در صورت خطا
        DB::rollBack();

        return response()->json([
            'error' => 'خطایی در حذف محصول رخ داد',
            'details' => $e->getMessage() // برای دیباگ، اختیاری
        ], 500);
    }
}


    public function toggle(Product $product,Request $request){

         $isAvailable = $request->input('is_available');

        // اعتبارسنجی ورودی
        $validated = $request->validate([
            'is_available' => 'required|boolean',
        ]);

         try{
           $marketable = $isAvailable ? 1 : 0 ;
           $product->marketable = $marketable;
           $product->save();
           return response()->json([
            'message' => 'وضعیت محصول با موفقیت تغییر کرد'
           ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در تغغیر وضعیت محصول رخ داد',
            ], 500);
        }

    }
}
