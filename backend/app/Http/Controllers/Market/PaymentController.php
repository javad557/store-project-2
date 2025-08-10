// app/Http/Controllers/PaymentController.php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    // شروع پرداخت و ارسال به زرین‌پال
    public function initiatePayment(Request $request)
    {
        // اعتبارسنجی داده‌های ارسالی از فرانت
        $request->validate([
            'amount' => 'required|integer|min:1000', // حداقل مبلغ (مثلاً ۱۰۰۰ تومان)
            'order_id' => 'required|string|unique:orders,order_id',
            'description' => 'nullable|string|max:255',
        ]);

        // ذخیره سفارش در دیتابیس
        $order = Order::create([
            'order_id' => $request->order_id,
            'amount' => $request->amount,
            'status' => 'pending',
        ]);

        // آماده‌سازی داده‌ها برای زرین‌پال
        $data = [
            'merchant_id' => env('ZARINPAL_MERCHANT_ID'),
            'amount' => $request->amount, // مبلغ به تومان
            'description' => $request->description ?? 'پرداخت سفارش ' . $request->order_id,
            'callback_url' => env('ZARINPAL_CALLBACK_URL'),
            'metadata' => [
                'order_id' => $request->order_id, // برای شناسایی سفارش در بازگشت
            ],
        ];

        try {
            // ارسال درخواست به API زرین‌پال
            $response = Http::post('https://api.zarinpal.com/pg/v4/payment/request.json', $data);

            $result = $response->json();

            if ($result['data']['code'] === 100) {
                // ذخیره Authority در دیتابیس
                $order->update(['authority' => $result['data']['authority']]);

                // لینک درگاه برای هدایت کاربر
                $paymentUrl = 'https://www.zarinpal.com/pg/StartPay/' . $result['data']['authority'];

                return response()->json([
                    'status' => 'success',
                    'payment_url' => $paymentUrl,
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'خطا در اتصال به زرین‌پال: ' . ($result['errors']['message'] ?? 'خطای ناشناخته'),
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Zarinpal initiate payment error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'خطایی در سرور رخ داد.',
            ], 500);
        }
    }

    // پردازش نتیجه پرداخت (Callback)
    public function paymentCallback(Request $request)
    {
        // گرفتن Authority و Status از زرین‌پال
        $authority = $request->query('Authority');
        $status = $request->query('Status');

        if (!$authority || $status !== 'OK') {
            return redirect('/payment-failed')->with('error', 'پرداخت ناموفق بود.');
        }

        // پیدا کردن سفارش با Authority
        $order = Order::where('authority', $authority)->first();

        if (!$order) {
            return redirect('/payment-failed')->with('error', 'سفارش یافت نشد.');
        }

        // تأیید پرداخت با API زرین‌پال
        $data = [
            'merchant_id' => env('ZARINPAL_MERCHANT_ID'),
            'authority' => $authority,
            'amount' => $order->amount, // مبلغ برای تأیید
        ];

        try {
            $response = Http::post('https://api.zarinpal.com/pg/v4/payment/verify.json', $data);
            $result = $response->json();

            if ($result['data']['code'] === 100) {
                // پرداخت موفق
                $order->update(['status' => 'paid']);
                return redirect('/payment-success')->with('success', 'پرداخت با موفقیت انجام شد. کد رهگیری: ' . $result['data']['ref_id']);
            } else {
                // پرداخت ناموفق
                $order->update(['status' => 'failed']);
                return redirect('/payment-failed')->with('error', 'تأیید پرداخت ناموفق بود: ' . ($result['errors']['message'] ?? 'خطای ناشناخته'));
            }
        } catch (\Exception $e) {
            Log::error('Zarinpal verify payment error: ' . $e->getMessage());
            return redirect('/payment-failed')->with('error', 'خطایی در سرور رخ داد.');
        }
    }
}