<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AdminUserRequest;
use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::where('is_admin', 1)
                ->with(['permissions', 'roles'])
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'last_name' => $user->last_name,
                        'full_name' => $user->name . ' ' . $user->last_name, // اضافه کردن full_name
                        'email' => $user->email,
                        'mobile' => $user->mobile,
                        'is_blocked' => $user->is_blocked ?? false, // اضافه کردن is_blocked
                        'permissions' => $user->permissions->pluck('name')->toArray(), // نام پرمیشن‌ها
                        'roles' => $user->roles->pluck('name')->toArray(), // نام رول‌ها
                    ];
                });

            // Log::info('Fetched admin users:', ['users' => $users]);
            return response()->json($users);
        } catch (\Exception $e) {
            Log::error('Error fetching admin users: ' . $e->getMessage(), [
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
    public function store(AdminUserRequest $request)
    {
        // Log::info('test',['storetest'=>$request->all()]);
        try{
            $user=User::create([
                'name'=>$request->name,
                'last_name'=>$request->last_name,
                'email'=>$request->email,
                'mobile'=>$request->mobile,
                'password'=>Hash::make($request->password),
                'national_code'=>$request->national_code,
                'birthdate'=>$request->birthdate,
                'is_admin'=>1,
            ]);
            $user->permissions()->attach($request->permissions);
            $user->roles()->attach($request->roles);
            return response()->json([
                'message'=>'کاربر ادمین با موفقیت افزوده شد'
            ]);
         } catch (\Exception $e) {
            Log::error('Error adding adminuser: ' . $e->getMessage(), [
            ]);
            return response()->json([
                'error' => 'خطایی در افزودن کاربر رخ داد',
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $adminuser)
    {
        try {
            // لود کردن کاربر به همراه پرمیشن‌ها و رول‌ها
            $user = User::with(['permissions', 'roles'])->findOrFail($adminuser->id);

            // ساختاردهی پاسخ JSON
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'permissions' => $user->permissions->pluck('id')->toArray(),
                'roles' => $user->roles->pluck('id')->toArray(),
                
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching admin user: ' . $e->getMessage(), [
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
    public function update(AdminUserRequest $request, User $adminuser)
    {
        // Log::info('test',['test'=>$request->all()]);
         try{
            $adminuser->update([
                'name'=>$request->name,
                'last_name'=>$request->last_name,
                'email'=>$request->email,
                'mobile'=>$request->mobile,
                'password'=>Hash::make($request->password),
                'national_code'=>$request->national_code,
                'birthdate'=>$request->birthdate,
                'is_admin'=>1,
            ]);
            $adminuser->permissions()->sync($request->permissions);
            $adminuser->roles()->sync($request->roles);
            return response()->json([
                'message'=>'کاربر ادمین با موفقیت ویرایش شد'
            ]);
         } catch (\Exception $e) {
            Log::error('Error adding adminuser: ' . $e->getMessage(), [
            ]);
            return response()->json([
                'error' => 'خطایی در ویرایش کاربر رخ داد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $adminuser)
    {
        try {
            // شروع تراکنش
            DB::beginTransaction();
            
            $adminuser->tickets()->delete();
            $adminuser->permissions()->detach();
            $adminuser->roles()->detach();
            $adminuser->delete();

            DB::commit();

            return response()->json([
                'message' => 'کاربر مورد نظر موفقیت حذف شد',
            ], 200);

        } catch (\Exception $e) {
            // رول‌بک تراکنش در صورت خطا
            DB::rollBack();

            Log::error('Error deleting admin user: ' . $e->getMessage(), [
                'user_id' => $adminuser->id,
                'stack' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'خطایی در حذف کاربر مورد نظر رخ داد',
            ], 500);
        }
    }

    public function changeBlock(User $adminuser){
        // Log::info('test',['test',$adminuser]);
         try{
            $blockStatus=$adminuser->is_blocked == 1 ? 0 : 1 ;
            $adminuser->is_blocked = $blockStatus;
            $adminuser->save();
            return response()->json([
                'message'=>'وضعیت بلاکی کاربر مورد نظر با موفقی تغییر کرد'
            ]);
            
         } catch (\Exception $e) {
            Log::error('Error changeBlock adminuser: ' . $e->getMessage(), [
            ]);
            return response()->json([
                'error' => 'خطایی در تغییر وضعیت کاربر رخ داد',
            ], 500);
        }
    }
}
