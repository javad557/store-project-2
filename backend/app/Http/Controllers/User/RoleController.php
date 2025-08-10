<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\RoleRequest;
use App\Models\User\Permission;
use App\Models\User\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
       public function index()
    {
        try {
            // دریافت تمام نقش ها به همراه نقش‌های مرتبط
            $roles = Role::with('permissions')->get()->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                        ];
                    })->toArray(),
                    'description' => $role->descriptions ?? '',
                ];
            });


           $permissions = Permission::all()->map(function ($permission) {
                return ['id' => $permission->id, 'name' => $permission->name];
            });
            // Log::info('Permissions and roles fetched', ['permissions' => $permissions, 'roles' => $roles]);

            return response()->json([
                'permissions' => $permissions,
                'roles' => $roles,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching roles: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در دریافت نقش ها'], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
         try {
            $role=Role::create([
                'name' => $request->name,
                'descriptions' => $request->description ?? null,
            ]);

            // همگام‌سازی نقش‌ها در جدول واسطه
            $role->permissions()->attach($request->permissions ?? []);

            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'نقش با موفقیت افزوده شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error adding role: ' . $e->getMessage());
            return response()->json(['error' => 'خطا در افزودن نقش مورد نظر'], 500);
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
    public function update(RoleRequest $request, Role $role)
    {
        // Log::info('test',['updatetest'=>$request->all()]);
         try {
            // به‌روزرسانی فیلدهای Permission
            $role->update([
                'name' => $request->name,
                'descriptions' => $request->description ?? null,
            ]);

            // همگام‌سازی نقش‌ها در جدول واسطه
            $role->permissions()->sync($request->permissions ?? []);

            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'نقش با موفقیت ویرایش شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error updating role: ' . $e->getMessage(), [
            ]);
            return response()->json(['error' => 'خطا در ویرایش نقش مورد نظر'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        try {
            $role->permissions()->detach();
            $role->delete();
            // پاسخ موفقیت‌آمیز
            return response()->json([
                'message' => 'نقش با موفقیت حذف شد']);
        } catch (\Exception $e) {
            // لاگ خطای عمومی
            Log::error('Error deleting role: ' . $e->getMessage(), [
            ]);
            return response()->json(['error' => 'خطا در حذف نقش مورد نظر'], 500);
        }
    }
}
