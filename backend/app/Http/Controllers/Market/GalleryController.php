<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\GalleyRequest;
use App\Models\Market\Gallery;
use App\Models\Market\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Product $product)
    {
        try {
            $gallery = $product->gallery; // دریافت تصاویر محصول
            return response()->json([
                'images' => $gallery,
                'product_name' => $product->name // فرض کردم فیلد نام محصول 'name' است
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت عکس‌های محصول رخ داد: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function setMain(Gallery $image, Product $product){
        // Log::info('محصول', ['محصول'=>$product->name]);

        if($image->product_id != $product->id){
            return response()->json([
                'error'=>'تصویر به محصول تعلق ندارد'
            ]);
        }

        if($image->is_main){
            $image->is_main=0;
            $image->save();
            return response()->json([
                'message'=>'تصویر مورد نظر با موفقیت از تصویر اصلی بودن خارج شد'
            ]);
        }

        $product->gallery()->where('is_main', 1)->update(['is_main' => 0]);
         $image->is_main=1;
            $image->save();
            return response()->json([
                'message'=>'تصویر مورد نظر با موفقیت به عنوان تصویر اصلی قرار گرفت'
            ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Product $product,GalleyRequest $request)
    {
        try {
        foreach($request->file('images') as $file){
            $path='images/products/'.$product->id;
            $storedPath = $file->store($path, 'public');
            Gallery::create([
                'image'=>$storedPath,
                'is_main'=>0,
                'product_id'=>$product->id,
            ]);
        }
         return response()->json([
                'message'=>'تصاویر مورد نظر با موفقیت برای محصول افزوده شدند'
            ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'خطایی در آپلود تصاویر رخ داد: ' . $e->getMessage(),
        ], 500);
    }
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
    public function destroy(Gallery $image)
    {
        try {
            $image->delete();
            return response()->json([
                'message'=>'تصویر مورد نظر با موفقیت از گالری محصول حذف گردید'
            ]);
           
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در حذف عکس محصول رخ داد: ' . $e->getMessage(),
            ], 500);
        }
    }
}
