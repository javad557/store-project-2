<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\ProductRequest;
use App\Models\Market\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $products = Product::query()
            ->select('id', 'name', 'category_id', 'brand_id', 'price', 'marketable')
            ->get();
            return response()->json($products);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت محصولات رخ داد',
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
        try{
            return response()->json($product);
           
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
         try{
            $product->delete();
            return response()->json([
                'message'=>'محصول مورد نظر با موفقیت حذف شد'
            ]);
           
         } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در حذف محصولا رخ داد',
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
