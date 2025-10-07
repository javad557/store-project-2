<?php


use App\Http\Controllers\Admin\DeliveryController;
use App\Http\Controllers\Admin\LoginRegisterManagmentController;
use App\Http\Controllers\Admin\Market\BrandController;
use App\Http\Controllers\Admin\Market\CategoryController;
use App\Http\Controllers\Admin\Market\CommentController;
use App\Http\Controllers\Admin\Market\GalleryController;
use App\Http\Controllers\Admin\Market\GuaranteeController;
use App\Http\Controllers\Admin\Market\ProductController;
use App\Http\Controllers\Admin\Market\VariantController;
use App\Http\Controllers\Admin\Marketing\AmazingController;
use App\Http\Controllers\Admin\Marketing\BannerController;
use App\Http\Controllers\Admin\Marketing\CopanController;
use App\Http\Controllers\Admin\Marketing\PageController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\Ticket\CategoryTicketController;
use App\Http\Controllers\Admin\Ticket\TicketController;
use App\Http\Controllers\Admin\User\AdminUserController;
use App\Http\Controllers\Admin\User\CustomerUserController;
use App\Http\Controllers\Admin\User\PermissionController;
use App\Http\Controllers\Admin\User\RoleController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\TwoFactorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Ticket\PriorityTicketController;












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


Route::prefix('admin')->middleware(['auth:api','admin'])->group(function () {

    Route::prefix('market')->group(function () {

        Route::prefix('categories')->group(function () {
            Route::get('/', [CategoryController::class, 'index'])->middleware('permission:read_categories');
            Route::get('/{category}', [CategoryController::class, 'show'])->middleware('permission:edit_category');
            Route::post('/', [CategoryController::class, 'store'])->middleware('permission:add_category');
            Route::put('/{category}', [CategoryController::class, 'update'])->middleware('permission:edit_category');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->middleware('permission:delete_category');
        });
        
        Route::prefix('brands')->group(function () {
            Route::get('/', [BrandController::class, 'index'])->middleware('permission:read_brands');
            Route::get('/{brand}', [BrandController::class, 'show'])->middleware('permission:edit_brand');
            Route::post('/', [BrandController::class, 'store'])->middleware('permission:add_brand');
            Route::put('/{brand}', [BrandController::class, 'update'])->middleware('permission:edit_brand');
            Route::delete('/{brand}', [BrandController::class, 'destroy'])->middleware('permission:delete_brand');
        });

        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->middleware('permission:read_products');
            Route::get('/{product}', [ProductController::class, 'show'])->middleware('permission:edit_product');
            Route::post('/', [ProductController::class, 'store'])->middleware('permission:add_product');
            Route::put('/{product}', [ProductController::class, 'update'])->middleware('permission:edit_product');
            Route::delete('/{product}', [ProductController::class, 'destroy'])->middleware('permission:edit_product');
            Route::put('toggle/{product}', [ProductController::class, 'toggle'])->middleware('permission:edit_product');
        });


         Route::prefix('guarantees')->group(function () {
            Route::get('/{product}', [GuaranteeController::class, 'index'])->middleware('permission:read_guarantees');
            Route::get('/{guarantee}/{product}', [GuaranteeController::class, 'show'])->middleware('permission:edit_guarantee');
            Route::post('/{product}', [GuaranteeController::class, 'store'])->middleware('permission:add_guarantee');
            Route::put('/{guarantee}/{product}', [GuaranteeController::class, 'update'])->middleware('permission:edit_guarantee');
            Route::delete('/{guarantee}', [GuaranteeController::class, 'destroy'])->middleware('permission:edit_guarantee');
        });


         Route::prefix('gallery')->group(function () {
            Route::get('/{product}', [GalleryController::class, 'index'])->middleware('permission:read_products');
            Route::get('/{image}/{product}', [GalleryController::class, 'show'])->middleware('permission:edit_product');
            Route::post('/{product}', [GalleryController::class, 'store'])->middleware('permission:add_product');
            Route::put('/{image}/{product}', [GalleryController::class, 'update'])->middleware('permission:edit_product');
            Route::delete('/{image}', [GalleryController::class, 'destroy'])->middleware('permission:edit_product');
            Route::put('/set-main/{image}/{product}', [GalleryController::class, 'setMain'])->middleware('permission:edit_product');
        });


        Route::prefix('variants')->group(function () {
            Route::get('/{product}', [VariantController::class, 'index'])->middleware('permission:read_variants');
            Route::post('/{product}', [VariantController::class, 'store'])->middleware('permission:variant_managment');
            Route::put('/{variant}', [VariantController::class, 'update'])->middleware('permission:variant_managment');
            Route::delete('/{variant}', [VariantController::class, 'destroy'])->middleware('permission:variant_managment');
        });

        Route::prefix('comments')->group(function () {
            Route::get('/', [CommentController::class, 'index'])->middleware('permission:read_comments');
            Route::patch('/changeStatus/{comment}', [CommentController::class, 'changeStatus'])->middleware('permission:read_comments');
            // Route::get('/{image}/{product}', [CommentController::class, 'show']);
            // Route::post('/{product}', [CommentController::class, 'store']);
            // Route::put('/{variant}', [CommentController::class, 'update']);
            // Route::delete('/{variant}', [CommentController::class, 'destroy']);
            // Route::put('/set-main/{image}/{product}', [CommentController::class, 'setMain']);
        });
    });

    Route::prefix('marketing')->group(function () {

        Route::prefix('banners')->group(function () {
            Route::get('/', [BannerController::class, 'index'])->middleware('permission:read_banners');
            Route::get('/{banner}', [BannerController::class, 'show'])->middleware('permission:edit_banner');
            Route::post('/', [BannerController::class, 'store'])->middleware('permission:add_banner');
            Route::put('/{banner}', [BannerController::class, 'update'])->middleware('permission:edit_banner');
            Route::delete('/{banner}', [BannerController::class, 'destroy'])->middleware('permission:edit_banner');
        });


         Route::prefix('copans')->group(function () {
            Route::get('/', [CopanController::class, 'index'])->middleware('permission:read_copans');
            Route::patch('/changeStatus/{copan}', [CopanController::class, 'changeStatus'])->middleware('permission:edit_copan');
            Route::get('/{copan}', [CopanController::class, 'show'])->middleware('permission:edit_copan');
            Route::post('/', [CopanController::class, 'store'])->middleware('permission:add_copan');
            Route::put('/{copan}', [CopanController::class, 'update'])->middleware('permission:edit_copan');
            Route::delete('/{copan}', [CopanController::class, 'destroy'])->middleware('permission:edit_copan');
        });

        Route::prefix('amazings')->group(function () {
            Route::get('/', [AmazingController::class, 'index'])->middleware('permission:read_amazings');
            Route::get('/{amazing}', [AmazingController::class, 'show'])->middleware('permission:edit_amazing');
            Route::post('/', [AmazingController::class, 'store'])->middleware('permission:add_amazing');
            Route::put('/{amazing}', [AmazingController::class, 'update'])->middleware('permission:edit_amazing');
             Route::patch('/changeStatus/{amazing}', [AmazingController::class, 'changeStatus'])->middleware('permission:edit_amazing');
            Route::delete('/{amazing}', [AmazingController::class, 'destroy'])->middleware('permission:edit_amazing');
        });

        Route::prefix('pages')->group(function () {
            Route::get('/', [pageController::class, 'index'])->middleware('permission:read_pages');
             Route::get('/{page}', [pageController::class, 'show'])->middleware('permission:read_pages');
             Route::post('/', [pageController::class, 'store'])->middleware('permission:add_pages');
             Route::put('/{page}', [pageController::class, 'update'])->middleware('permission:edit_pages');
            Route::put('updateStatus/{page}', [pageController::class, 'updateStatus'])->middleware('permission:edit_pages');
            Route::delete('/{page}', [pageController::class, 'destroy'])->middleware('permission:edit_pages');
        });

    });

    Route::prefix('users')->group(function () {

         Route::prefix('adminusers')->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->middleware('permission:read_adminusers');
            // Route::patch('/changeStatus/{comment}', [AdminUserController::class, 'changeStatus']);
            Route::get('/{adminuser}', [AdminUserController::class, 'show'])->middleware('permission:edit_adminuser');
            Route::post('/', [AdminUserController::class, 'store'])->middleware('permission:add_adminuser');
            Route::put('/{adminuser}', [AdminUserController::class, 'update'])->middleware('permission:edit_adminuser');
            Route::delete('/{adminuser}', [AdminUserController::class, 'destroy'])->middleware('permission:edit_adminuser');
            Route::patch('/changeBlock/{adminuser}', [AdminUserController::class, 'changeBlock'])->middleware('permission:edit_adminuser');
        });

         Route::prefix('customerusers')->group(function () {
            Route::get('/', [CustomerUserController::class, 'index'])->middleware('permission:read_customerusers');
            // Route::patch('/changeStatus/{comment}', [CustomerUserController::class, 'changeStatus']);
            Route::get('/{customeruser}', [CustomerUserController::class, 'show'])->middleware('permission:edit_customeruser');
            // Route::post('/', [CustomerUserController::class, 'store']);
            Route::put('/{customeruser}', [CustomerUserController::class, 'update'])->middleware('permission:edit_customeruser');
            Route::delete('/{customeruser}', [CustomerUserController::class, 'destroy'])->middleware('permission:edit_customeruser');
             Route::patch('/changeBlock/{customeruser}', [CustomerUserController::class, 'changeBlock'])->middleware('permission:edit_customeruser');
        });

         Route::prefix('permissions')->group(function () {
            Route::get('/', [PermissionController::class, 'index'])->middleware('permission:read_permissions');
            Route::post('/', [PermissionController::class, 'store'])->middleware('permission:add_permission');
            Route::put('/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit_permission');
            Route::delete('/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:edit_permission');
        });

        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('permission:read_roles');
            // Route::patch('/changeStatus/{comment}', [RoleController::class, 'changeStatus']);
            // Route::get('/{banner}', [RoleController::class, 'show']);
            Route::post('/', [RoleController::class, 'store'])->middleware('permission:add_role');
            Route::put('/{role}', [RoleController::class, 'update'])->middleware('permission:edit_role');
            Route::delete('/{role}', [RoleController::class, 'destroy'])->middleware('permission:edit_role');
            // Route::put('/set-main/{image}/{product}', [RoleController::class, 'setMain']);
        });

    });

     Route::prefix('deliveries')->group(function () {
        Route::get('/', [DeliveryController::class, 'index'])->middleware('permission:read_deliveries');
        Route::get('/{delivery}', [DeliveryController::class, 'show'])->middleware('permission:edit_delivery');
        Route::post('/', [DeliveryController::class, 'store'])->middleware('permission:add_delivery');
        Route::put('/{delivery}', [DeliveryController::class, 'update'])->middleware('permission:edit_delivery');
        Route::delete('/{delivery}', [DeliveryController::class, 'destroy'])->middleware('permission:edit_delivery');
    });

     Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index'])->middleware('permission:read_deliveries');
        
        // Route::get('/{delivery}', [DeliveryController::class, 'show'])->middleware('permission:edit_delivery');
        // Route::post('/', [DeliveryController::class, 'store'])->middleware('permission:add_delivery');
        // Route::put('/{delivery}', [DeliveryController::class, 'update'])->middleware('permission:edit_delivery');
        // Route::delete('/{delivery}', [DeliveryController::class, 'destroy'])->middleware('permission:edit_delivery');
    });

    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->middleware('permission:read_orders');
        Route::put('/{id}', [OrderController::class, 'updateStatus'])->middleware('permission:edit_orders');
        Route::get('/{order}', [OrderController::class, 'show'])->middleware('permission:read_orders');
        Route::get('/order_items/{order}', [OrderController::class, 'order_items'])->middleware('permission:read_orders');
        // Route::post('/', [DeliveryController::class, 'store'])->middleware('permission:read_orders');
        // Route::put('/{order}', [DeliveryController::class, 'update'])->middleware('permission:read_orders');
        // Route::delete('/{order}', [DeliveryController::class, 'destroy'])->middleware('permission:read_orders');
    });


     Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index'])->middleware('permission:read_tickets');
        Route::get('/allTickets', [TicketController::class, 'allTickets'])->middleware('permission:read_tickets');
        Route::post('/change_status/{ticket}', [TicketController::class, 'change_status'])->middleware('permission:read_tickets');
        Route::get('/{ticket}', [TicketController::class, 'show'])->where('ticket', '[0-9]+')->middleware('permission:read_tickets');
        Route::post('/', [TicketController::class, 'store'])->middleware('permission:read_orders');
        Route::post('/mark_tickets_as_seen', [TicketController::class, 'mark_tickets_as_seen'])->middleware('permission:read_orders');

        Route::get('/category_tickets', [CategoryTicketController::class, 'index'])->middleware('permission:read_tickets');
        Route::delete('/category_tickets/{category_ticket}', [CategoryTicketController::class, 'destroy'])->middleware('permission:edit_tickets');
        Route::put('/category_tickets/{category_ticket}', [CategoryTicketController::class, 'update_category_tcicket'])->middleware('permission:edit_tickets');
        Route::post('/category_tickets', [CategoryTicketController::class, 'add_category_ticket'])->middleware('permission:edit_tickets');

        Route::get('/priority_tickets', [PriorityTicketController::class, 'index'])->middleware('permission:read_tickets');
        Route::delete('/priority_tickets/{priority_ticket}', [PriorityTicketController::class, 'destroy'])->middleware('permission:edit_tickets');
        Route::put('/priority_tickets/{priority_ticket}', [PriorityTicketController::class, 'update_priority_tcicket'])->middleware('permission:edit_tickets');
        Route::post('/priority_tickets', [PriorityTicketController::class, 'add_priority_ticket'])->middleware('permission:edit_tickets');
    });

   
});

 Route::prefix('loginregistermanagment')->group(function () {
        Route::get('/', [LoginRegisterManagmentController::class, 'index']);
        // Route::get('/{loginregistermanagment}', [LoginRegisterManagmentController::class, 'show']);
        // Route::post('/', [LoginRegisterManagmentController::class, 'store']);
        Route::put('/{loginregistermanagment}', [LoginRegisterManagmentController::class, 'update'])->middleware(['auth:api','admin','permission:loginresiter_managment']);
        // Route::delete('/{delivery}', [LoginRegisterManagmentController::class, 'destroy']);
});


Route::prefix('auth')->group(function () {

    Route::post('/sendOtp', [AuthController::class, 'sendOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::get('/recovery-codes', [AuthController::class, 'getRecoveryCodes']);
    Route::post('/verify-two-factor', [AuthController::class, 'verifyTwoFactor']);
    Route::post('/enable-two-factor', [TwoFactorController::class, 'enableTwoFactor'])->middleware('auth:api');
    Route::post('/disable-two-factor', [TwoFactorController::class, 'disableTwoFactor'])->middleware('auth:api');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
});


Route::get('/recaptcha-config', function () {
    return response()->json(['site_key' => config('recaptcha.api_site_key')]);
});