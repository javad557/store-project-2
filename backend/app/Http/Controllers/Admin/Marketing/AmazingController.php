<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Marketing\AmazingRequest;
use App\Models\Marketing\Amazing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AmazingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $amazings = Amazing::with(['product'])->get();
            return response()->json($amazings);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت فروش های شگفت انگیز: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت فروش های شگفت انگیز'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AmazingRequest $request)
    {
        // Log::info('test',['test'=>$request->all()]);
        try{
            Amazing::create([
                'product_id'=>$request->product_id,
                'amount'=>$request->amount,
                'end_date'=>$request->end_date,
            ]);
            response()->json([
                'message'=>'فروش شگفت انگیز مورد نظر با موفقیت افزوده شد'
            ]);

        } catch (\Exception $e) {
            Log::error('خطا در افزودن فروش  شگفت انگیز: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در افزودن فروش  شگفت انگیز'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Amazing $amazing)
    {
         try{
            return response()->json($amazing);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت فروش شگفت انگیز: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت فروش شگفت انگیز'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AmazingRequest $request,Amazing $amazing)
    {
        // Log::info('test',['updatetest'=>$request->all()]);
        try{
            $amazing->update([
                'product_id'=>$request->product_id,
                'amount'=>$request->amount,
                'end_date'=>$request->end_date,
            ]);
            response()->json([
                'message'=>'فروش شگفت انگیز مورد نظر با موفقیت ویرایش شد'
            ]);

        } catch (\Exception $e) {
            Log::error('خطا در ویرایش فروش  شگفت انگیز: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در ویرایش فروش  شگفت انگیز'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Amazing $amazing)
    {
         try{
            $amazing->delete();
            return response()->json([
                'message'=>'فروش شگفت انگیز با موفقیت حذف شد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در حذف فروش شگفت انگیز رخ داد: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در حذف فروش شگفت انگیز رخ داد'], 500);
        }
    }

    public function changeStatus(Amazing $amazing){
        // Log::info('changestatustest',['test',$amazing]);
        try{
            $newStatus=$amazing->status == 1 ? 0 : 1 ;
            $amazing->status = $newStatus;
            $amazing->save();
            return response()->json([
                'message'=>'وضعیت با موفقیت تغییر کرد'
            ]);
        } catch (\Exception $e) {
            Log::error('خطا در تغییر وضعیت رخ داد: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در تغییر وضعیت رخ داد'], 500);
        }
    }
}
