<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\CustomerUserRequest;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class CustomerUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Log::info('test',['test'=>'success']);
        try {
            $users = User::where('is_admin', 0)->get();
            // Log::info('Fetched admin users:', ['users' => $users]);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching customer users: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'خطایی در دریافت کاربران رخ داد',
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
    public function show(User $customeruser)
    {
        try {
            return response()->json($customeruser);
        } catch (\Exception $e) {
            Log::error('Error fetching customer user: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'error' => 'خطایی در دریافت اطلاعات کاربر رخ داد',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
     public function update(CustomerUserRequest $request, User $customeruser)
    {
        try {
            // به‌روزرسانی فیلدهای کاربر با داده‌های درخواست
            $customeruser->update([
                'name' => $request->input('name'),
                'last_name' => $request->input('last_name'),
                'email' => $request->input('email'),
                'mobile' => $request->input('mobile'),
                'national_code' => $request->input('national_code'),
                'birthdate' => $request->input('birthdate'), // تاریخ به‌صورت میلادی YYYY-MM-DD
                'password' => $request->filled('password') ? Hash::make($request->input('password')) : $customeruser->password,
            ]);

            return response()->json([
                'message' => 'کاربر مشتری مورد نظر با موفقیت ویرایش شد',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating customer user: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);
            return response()->json([
                'error' => 'خطایی در ویرایش کاربر مشتری رخ داد',
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $customeruser)
    {
        // Log::info('test',['test',$customeruser]);
          try{
             DB::beginTransaction();

            $customeruser->comparisons()->delete();
            $customeruser->favorites()->delete();
            $customeruser->carts()->delete();

            $customeruser->orders()->each(function ($order) {
                $order->items()->delete();
                $order->delete();
            });

            $customeruser->comments()->delete();
            $customeruser->ratings()->delete();
            $customeruser->violations()->delete();
            $customeruser->copans()->delete();
            $customeruser->otps()->delete();
            $customeruser->recoveryCodes()->delete();
            $customeruser->tickets()->each(function ($ticket) {
                $ticket->children()->delete();
                $ticket->delete();
            });
         
            $customeruser->addresses()->delete();

            DB::commit();

            $customeruser->delete();
            return response()->json([
                'message'=>'  کاربر مورد نظر با موفقیت حذف شد'
            ]);
            
         } catch (\Exception $e) {
            Log::error('Error delete customeruser: ' . $e->getMessage(), [
            ]);
            return response()->json([
                'error' => 'خطایی در حذف کاربر مورد نظر رخ داد',
            ], 500);
        }
    }

     public function changeBlock(User $customeruser){
        // Log::info('test',['test',$customeruser]);
         try{
            $blockStatus=$customeruser->is_blocked == 1 ? 0 : 1 ;
            $customeruser->is_blocked = $blockStatus;
            $customeruser->save();
            return response()->json([
                'message'=>'وضعیت بلاکی کاربر مورد نظر با موفقی تغییر کرد'
            ]);
            
         } catch (\Exception $e) {
            Log::error('Error changeBlock customeruser: ' . $e->getMessage(), [
            ]);
            return response()->json([
                'error' => 'خطایی در تغییر وضعیت کاربر رخ داد',
            ], 500);
        }
    }
}
