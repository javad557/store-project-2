<?php

use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\LoginRegisterManagmentController;
use App\Http\Controllers\Market\BrandController;
use App\Http\Controllers\Market\CategoryController;
use App\Http\Controllers\Market\CommentController;
use App\Http\Controllers\Market\GalleryController;
use App\Http\Controllers\Market\GuaranteeController;
use App\Http\Controllers\Market\ProductController;
use App\Http\Controllers\Market\VariantController;
use App\Http\Controllers\Marketing\AmazingController;
use App\Http\Controllers\Marketing\BannerController;
use App\Http\Controllers\Marketing\CopanController;
use App\Http\Controllers\User\AdminUserController;
use App\Http\Controllers\User\CustomerUserController;
use App\Http\Controllers\User\PermissionController;
use App\Http\Controllers\User\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;









/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/test', function () {
    return response()->json(['message' => 'Hello from Laravel!']);
});


Route::prefix('admin')->group(function () {

    Route::prefix('market')->group(function () {

        Route::prefix('categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index']);
            Route::get('/{category}', [CategoryController::class, 'show']);
            Route::post('/', [CategoryController::class, 'store']);
            Route::put('/{category}', [CategoryController::class, 'update']);
            Route::delete('/{category}', [CategoryController::class, 'destroy']);
        });
        
        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index']);
            Route::get('/{brand}', [BrandController::class, 'show']);
            Route::post('/', [BrandController::class, 'store']);
            Route::put('/{brand}', [BrandController::class, 'update']);
            Route::delete('/{brand}', [BrandController::class, 'destroy']);
        });

        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index']);
            Route::get('/{product}', [ProductController::class, 'show']);
            Route::post('/', [ProductController::class, 'store']);
            Route::put('/{product}', [ProductController::class, 'update']);
            Route::delete('/{product}', [ProductController::class, 'destroy']);
            Route::put('toggle/{product}', [ProductController::class, 'toggle']);
        });


         Route::prefix('guarantees')->group(function () {
            Route::get('/{product}', [GuaranteeController::class, 'index']);
            Route::get('/{guarantee}/{product}', [GuaranteeController::class, 'show']);
            Route::post('/{product}', [GuaranteeController::class, 'store']);
            Route::put('/{guarantee}/{product}', [GuaranteeController::class, 'update']);
            Route::delete('/{guarantee}', [GuaranteeController::class, 'destroy']);
        });


         Route::prefix('gallery')->group(function () {
            Route::get('/{product}', [GalleryController::class, 'index']);
            Route::get('/{image}/{product}', [GalleryController::class, 'show']);
            Route::post('/{product}', [GalleryController::class, 'store']);
            Route::put('/{image}/{product}', [GalleryController::class, 'update']);
            Route::delete('/{image}', [GalleryController::class, 'destroy']);
            Route::put('/set-main/{image}/{product}', [GalleryController::class, 'setMain']);
        });


        Route::prefix('variants')->group(function () {
            Route::get('/{product}', [VariantController::class, 'index']);
            Route::post('/{product}', [VariantController::class, 'store']);
            Route::put('/{variant}', [VariantController::class, 'update']);
            Route::delete('/{variant}', [VariantController::class, 'destroy']);
        });

        Route::prefix('comments')->group(function () {
            Route::get('/', [CommentController::class, 'index']);
            Route::patch('/changeStatus/{comment}', [CommentController::class, 'changeStatus']);
            // Route::get('/{image}/{product}', [CommentController::class, 'show']);
            // Route::post('/{product}', [CommentController::class, 'store']);
            // Route::put('/{variant}', [CommentController::class, 'update']);
            // Route::delete('/{variant}', [CommentController::class, 'destroy']);
            // Route::put('/set-main/{image}/{product}', [CommentController::class, 'setMain']);
        });
    });

    Route::prefix('marketing')->group(function () {

        Route::prefix('banners')->group(function () {
            Route::get('/', [BannerController::class, 'index']);
            Route::get('/{banner}', [BannerController::class, 'show']);
            Route::post('/', [BannerController::class, 'store']);
            Route::put('/{banner}', [BannerController::class, 'update']);
            Route::delete('/{banner}', [BannerController::class, 'destroy']);
        });


         Route::prefix('copans')->group(function () {
            Route::get('/', [CopanController::class, 'index']);
            Route::patch('/changeStatus/{copan}', [CopanController::class, 'changeStatus']);
            Route::get('/{copan}', [CopanController::class, 'show']);
            Route::post('/', [CopanController::class, 'store']);
            Route::put('/{copan}', [CopanController::class, 'update']);
            Route::delete('/{copan}', [CopanController::class, 'destroy']);
        });

        Route::prefix('amazings')->group(function () {
            Route::get('/', [AmazingController::class, 'index']);
            Route::get('/{amazing}', [AmazingController::class, 'show']);
            Route::post('/', [AmazingController::class, 'store']);
            Route::put('/{amazing}', [AmazingController::class, 'update']);
             Route::patch('/changeStatus/{amazing}', [AmazingController::class, 'changeStatus']);
            Route::delete('/{amazing}', [AmazingController::class, 'destroy']);
        });

    });

    Route::prefix('users')->group(function () {

         Route::prefix('adminusers')->group(function () {
            Route::get('/', [AdminUserController::class, 'index']);
            // Route::patch('/changeStatus/{comment}', [AdminUserController::class, 'changeStatus']);
            Route::get('/{adminuser}', [AdminUserController::class, 'show']);
            Route::post('/', [AdminUserController::class, 'store']);
            Route::put('/{adminuser}', [AdminUserController::class, 'update']);
            Route::delete('/{adminuser}', [AdminUserController::class, 'destroy']);
            Route::patch('/changeBlock/{adminuser}', [AdminUserController::class, 'changeBlock']);
        });

         Route::prefix('customerusers')->group(function () {
            Route::get('/', [CustomerUserController::class, 'index']);
            // Route::patch('/changeStatus/{comment}', [CustomerUserController::class, 'changeStatus']);
            Route::get('/{customeruser}', [CustomerUserController::class, 'show']);
            // Route::post('/', [CustomerUserController::class, 'store']);
            Route::put('/{customeruser}', [CustomerUserController::class, 'update']);
            Route::delete('/{customeruser}', [CustomerUserController::class, 'destroy']);
             Route::patch('/changeBlock/{customeruser}', [CustomerUserController::class, 'changeBlock']);
        });

         Route::prefix('permissions')->group(function () {
            Route::get('/', [PermissionController::class, 'index']);
            Route::post('/', [PermissionController::class, 'store']);
            Route::put('/{permission}', [PermissionController::class, 'update']);
            Route::delete('/{permission}', [PermissionController::class, 'destroy']);
        });

        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index']);
            // Route::patch('/changeStatus/{comment}', [RoleController::class, 'changeStatus']);
            // Route::get('/{banner}', [RoleController::class, 'show']);
            Route::post('/', [RoleController::class, 'store']);
            Route::put('/{role}', [RoleController::class, 'update']);
            Route::delete('/{role}', [RoleController::class, 'destroy']);
            // Route::put('/set-main/{image}/{product}', [RoleController::class, 'setMain']);
        });

    });

     Route::prefix('deliveries')->group(function () {
        Route::get('/', [DeliveryController::class, 'index']);
        Route::get('/{delivery}', [DeliveryController::class, 'show']);
        Route::post('/', [DeliveryController::class, 'store']);
        Route::put('/{delivery}', [DeliveryController::class, 'update']);
        Route::delete('/{delivery}', [DeliveryController::class, 'destroy']);
    });

    Route::prefix('loginregistermanagment')->group(function () {
        Route::get('/', [LoginRegisterManagmentController::class, 'index']);
        // Route::get('/{loginregistermanagment}', [LoginRegisterManagmentController::class, 'show']);
        // Route::post('/', [LoginRegisterManagmentController::class, 'store']);
        Route::put('/{loginregistermanagment}', [LoginRegisterManagmentController::class, 'update']);
        // Route::delete('/{delivery}', [LoginRegisterManagmentController::class, 'destroy']);
    });
});