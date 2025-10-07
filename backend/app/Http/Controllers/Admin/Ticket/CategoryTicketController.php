<?php

namespace App\Http\Controllers\Admin\Ticket;

use App\Http\Controllers\Controller;
use App\Models\support\CategoryTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Log::info('categorytickettest',['categorytickettest'=>'yes']);
        try{
            $category_tickets=CategoryTicket::all();
            return response()->json([
                'data'=>$category_tickets,
                'message'=>'دسته بندی ها با موفقیت دریافت شدند',
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'دریافت دسته بندی تیکتهای مورد نظر با خطا مواجه شد',
            ],500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update_category_tcicket(Request $request, CategoryTicket $category_ticket)
    {
        // Log::info('test',['updatetest'=>'yes']);
        try{
             $request->validate([
                'name' => 'required|string|max:255',
            ]);
            $category_ticket->name = $request->name;
            $category_ticket->save();
            return response()->json([
                'message'=>'نام دسته بندی تیکت مورد نظر با موفقیت تغییر کرد',
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'تغییر نام دسته بندی تیکت مورد نظر با خطا مواجه شد',
            ],500);
        }
    }


   public function add_category_ticket(Request $request)
{
    try {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        CategoryTicket::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'دسته‌بندی تیکت مورد نظر با موفقیت افزوده شد',
        ], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        // مدیریت خطاهای اعتبارسنجی
        return response()->json([
            'error' => 'خطای اعتبارسنجی',
            'errors' => $e->errors(), // لیست خطاهای اعتبارسنجی
        ], 422); // کد وضعیت 422 برای خطاهای اعتبارسنجی
    } catch (\Throwable $e) {
        // مدیریت سایر خطاها
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'افزودن دسته‌بندی تیکت مورد نظر با خطا مواجه شد',
        ], 500);
    }
}
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryTicket $category_ticket)
    {
        // Log::info('test',['deletetest'=>'yes']);
        try{
            $category_ticket->delete();
            return response()->json([
                'message'=>'حذف دسته بندی تیکت با موفقیت انجام شد',
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'حذف دسته بندی تیکت مورد نظر با خطا مواجه شد',
            ],500);
        }
    }
}
