<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseProcess\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
{
    try {
        $orders = Order::with(['user', 'payment_method', 'delivery_method','address.city'])->get();
        return response()->json([
            'data' => $orders,
            'message' => 'موفقیت در دریافت سفارشات',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'خطا در دریافت سفارشات',
        ], 500);
    }
}


public function updateStatus($id, Request $request)
{
    Log::info('test',['updatetest'=>$request->all()]);
    try {
        $order = Order::findOrFail($id);
        $order->status = $request->newStatus;
        $order->save();
        return response()->json([
            'data' => ['id' => $order->id, 'status' => $order->status],
            'message' => 'وضعیت سفارش با موفقیت تغییر کرد',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'خطا در تغییر وضعیت سفارش شما',
        ], 500);
    }
}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
   try {
        // relations رو روی $order لود کن (نه get() کل جدول!)
        $order->load(['user', 'payment_method', 'delivery_method', 'address.city']);
        
        return response()->json([
            'data' => $order,  // single order (نه آرایه)
            'message' => 'موفقیت در دریافت جزئیات سفارش',  // مفرد و دقیق
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'خطا در دریافت جزئیات سفارش',  // مفرد و دقیق
        ], 500);
    }
    }

    /**
     * Update the specified resource in storage.
     */
    public function order_items(Order $order)
    {
        try {
        // relations رو روی $order لود کن (نه get() کل جدول!)
        $order->load(['items.variant.product','items.variant.color']);
        return response()->json([
            'data' => $order,  // single order (نه آرایه)
            'message' => 'موفقیت در دریافت جزئیات سفارش',  // مفرد و دقیق
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'خطا در دریافت جزئیات سفارش',  // مفرد و دقیق
        ], 500);
    }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
