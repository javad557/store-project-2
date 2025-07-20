<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Http\Requests\Market\GuaranteeRequest;
use App\Models\Market\Guarantee;
use App\Models\Market\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GuaranteeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Product $product)
    {
        try{
             $guarantees=$product->guarantees;
             return response()->json($guarantees);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت گارانتی ها رخ داد',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Product $product,GuaranteeRequest $request)
    {
          try{
            $guarantee=Guarantee::create(['name'=>$request->name]);
            $product->guarantees()->attach($guarantee->id,[
                'duration'=>$request->duration,
                'price_increase'=>$request->price_increase,
            ]);
            return response()->json([
                'message'=>'گارانتی مورد نظر با موفقیت برای محصول مورد نظر افزوده شد'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در دریافت گارانتی ها رخ داد',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
  public function show(Guarantee $guarantee, Product $product)
{

    try {
        // فرض می‌کنیم product_id از درخواست (مثلاً query parameter) ارسال شده
        $guaranteeData = $product->guarantees->where('id', $guarantee->id)->first();

        if (!$guaranteeData) {
            return response()->json(['error' => 'گارانتی برای این محصول یافت نشد'], 404);
        }

        // ساختار پاسخ
        $response = [
            'id' => $guarantee->id,
            'name' => $guarantee->name,
            'duration' => $guaranteeData->pivot->duration,
            'price_increase' => $guaranteeData->pivot->price_increase,
        ];

        return response()->json($response);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'خطایی در دریافت گارانتی رخ داد',
            'message' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(GuaranteeRequest $request,Guarantee $guarantee, Product $product)
    {
        //   Log::info('داده‌های ورودی  :', ['ورودی ها'=>$request->all()]);
        try{
            $guarantee->update([
            'name' => $request->name,
        ]);

        // به‌روزرسانی جدول واسطه product_guarantee
        $guarantee->products()->updateExistingPivot($product->id, [
            'duration' => $request->duration,
            'price_increase' =>$request->price_increase,
        ]);

        return response()->json([
            'message' => 'گارانتی با موفقیت ویرایش شد',
        ], 200);


        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در اپدیت گارانتی مورد نظر رخ داد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guarantee $guarantee)
    {
        try{
             $guarantee->delete();
             return response()->json(
                ['message'=>'گارانتی مورد نظر با موفقیت حذف شد']
             );

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'خطایی در حذف گارانتی مورد نظر رخ داد',
            ], 500);
        }
    }
}
