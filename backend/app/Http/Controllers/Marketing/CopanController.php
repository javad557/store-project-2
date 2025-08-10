<?php

namespace App\Http\Controllers\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Marketing\CopanRequest;
use App\Http\Requests\User\UserRequest;
use App\Models\Marketing\Copan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CopanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
         try{
            $copans = Copan::with(['user'])->get();
             
            return response()->json($copans);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت کدهای تخفیف: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت کدهای تخفیف'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            Copan::create([
                'code'=>$request->code,
                'amount'=>$request->amount,
                'used'=>0,
                'end_date'=>$request->end_date,
                'status'=>1,
                'user_id'=>$request->user_id,
            ]);
            return response()->json([
                'message'=>'کد تخفیف با موفقیت افزوده شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت کدهای تخفیف: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در افزودن کد تخفیف'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Copan $copan)
    {
        try{
            return response()->json($copan);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت کد تخفیف: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت کد تخفیف'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CopanRequest $request, Copan $copan)
    {
        // Log::info('test',['test',$request->all()]);
         try{
            $copan->update([
                'code'=>$request->code,
                'amount'=>$request->amount,
                'used'=>$request->used,
                'end_date'=>$request->end_date,
                'status'=>$request->status,
                'user_id'=>$request->user_id,
            ]);
            return response()->json([
                'message'=>'کد تخفیف با موفقیت ویرایش شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در ویرایش کد تخفیف: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ویرایش کد تخفیف'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Copan $copan)
    {
         try {
            $copan->delete();
        return response()->json([
            'message' => ' کد تخفیف با موفقیت حذف شد',
        ]);
    } catch (\Exception $e) {
        Log::error('خطا در حذف کد تخفیف: ' . $e->getMessage());
        return response()->json(['error' => 'خطا در حذف کد تخفیف']);
    }
    }


   public function changeStatus(Copan $copan)
{
    Log::info('تغییر وضعیت کد تخفیف:', ['copan_id' => $copan->id, 'current_status' => $copan->status]);
    try {
        // تغییر وضعیت: 0 به 1 یا 1 به 0
        $newStatus = $copan->status === 1 ? 0 : 1;
        $copan->update([
            'status' => $newStatus,
        ]);
        return response()->json([
            'message' => 'وضعیت کد تخفیف با موفقیت تغییر کرد',
            'data' => $copan,
        ], 200);
    } catch (\Exception $e) {
        Log::error('خطا در تغییر وضعیت کد تخفیف: ' . $e->getMessage(), ['copan_id' => $copan->id]);
        return response()->json(['error' => 'خطا در تغییر وضعیت کد تخفیف'], 500);
    }
}
}
