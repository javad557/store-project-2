<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeliveryRequest;
use App\Models\PurchaseProcess\DeliveryMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Log::info('test',['deliverytest'=>'yes']);
         try{
            $deliveries = DeliveryMethod::all();
            return response()->json($deliveries);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت روش های ارسال: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت روش های ارسال'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DeliveryRequest $request)
    {
        // Log::info('test',['deliverystoretest'=>$request->all()]);
         try{
            DeliveryMethod::create([
                'name'=>$request->name,
                'amount'=>$request->amount,
                'delivery_time'=>$request->delivery_time,
            ]);
            return response()->json([
                'message'=>'روش ارسال مورد نظر با موفقیت افزوده شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در افزودن روش ارسال: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در افزودن روش ارسال'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(DeliveryMethod $delivery)
    {
          try{
            return response()->json($delivery);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت روش ارسال مورد نظر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت روش ارسال مورد نظر'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DeliveryRequest $request, DeliveryMethod $delivery)
    {
        //  Log::info('test',['deliveryupdatetest'=>$request->all()]);
         try{
            $delivery->update([
                'name'=>$request->name,
                'amount'=>$request->amount,
                'delivery_time'=>$request->delivery_time,
            ]);
            return response()->json([
                'message'=>'روش ارسال مورد نظر با موفقیت ویرایش شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در ویرایش روش مورد نظر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ویرایش روش ارسال مورد نظر'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DeliveryMethod $delivery)
    {
         try{
            $delivery->delete();
            return response()->json([
                'message'=>'روش ارسال مورد نظر با موفقیت حذف شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در حذف روش مورد نظر: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در حذف روش ارسال مورد نظر'], 500);
        }
    }
}
