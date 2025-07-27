<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Market\CategoryController;
use App\Http\Controllers\Market\BrandController;
use App\Http\Controllers\Market\ProductController;
use App\Http\Controllers\Market\GuaranteeController;
use App\Http\Controllers\Market\GalleryController;
use App\Http\Controllers\Market\VariantController;

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
            // Route::get('/{image}/{product}', [GalleryController::class, 'show']);
            Route::post('/{product}', [VariantController::class, 'store']);
            Route::put('/{variant}', [VariantController::class, 'update']);
            Route::delete('/{variant}', [VariantController::class, 'destroy']);
            // Route::put('/set-main/{image}/{product}', [GalleryController::class, 'setMain']);
        });
    });
});