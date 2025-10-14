<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\PermissionRequest;
use App\Models\User\Permission;
use App\Models\User\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
    {
        Log::info('tet',['permissiontest'=>'yes']);
        try {
            // دریافت تمام دسترسی‌ها به همراه نقش‌های مرتبط
            $permissions = Permission::with('roles')->get()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'roles' => $permission->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                        ];
                    })->toArray(),
                    'description' => $permission->descriptions ?? '',
                ];
            });

            // استخراج لیست منحصربه‌فرد نقش‌ها برای دراپ‌داون
           $roles = Role::all()->map(function ($role) {
                return ['id' => $role->id, 'name' => $role->name];
            });
            // Log::info('Permissions and roles fetched', ['permissions' => $permissions, 'roles' => $roles]);

            return response()->json([
                'roles' => $roles,
                'permissions' => $permissions,
              
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching permissions: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت سطوح دسترسی'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PermissionRequest $request)
    {
        try {
            $permission=Permission::create([
                'name' => $request->name,
                'descriptions' => $request->description ?? null,
            ]);

            // همگام‌سازی نقش‌ها در جدول واسطه
            $permission->roles()->attach($request->roles ?? []);

            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'دسترسی با موفقیت افزوده شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error adding permission: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در افزودن دسترسی مورد نظر'], 500);
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
    public function update(PermissionRequest $request, Permission $permission)
    {
        try {
            // به‌روزرسانی فیلدهای Permission
            $permission->update([
                'name' => $request->name,
                'descriptions' => $request->description ?? null,
            ]);

            // همگام‌سازی نقش‌ها در جدول واسطه
            $permission->roles()->sync($request->roles ?? []);

            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'دسترسی با موفقیت ویرایش شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error updating permission: ' . $e->getMessage(), [
                'permission_id' => $permission->id,
                'request_data' => $request->all(),
            ]);
            return response()->json(['error' => 'خطا در ویرایش دسترسی مورد نظر'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        try {
            $permission->roles()->detach($permission->roles);
            $permission->delete();
            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'دسترسی با موفقیت حذف شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error deleting permission: ' . $e->getMessage(), [
            ]);
            return response()->json(['error' => 'خطا در حذف دسترسی مورد نظر'], 500);
        }
    }
}
