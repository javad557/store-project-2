<?php

namespace App\Http\Controllers\Main\Market;

use App\Http\Controllers\Controller;
use App\Models\Market\Category;
use App\Models\Market\Product;
use App\Models\Profile\Favorite;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    
       /**
     * لیست همه محصولات با عکس اصلی
     */
    /**
     * لیست همه محصولات با عکس اصلی
     */

    public function index()
    {
        $products = Cache::remember('products_index', 300, function () {
            return Product::with(['mainImage' => function ($query) {
                $query->select('id', 'product_id', 'image');
            }])
                ->select('id', 'name', 'price', 'description', 'marketable', 'published_at', 'sold_number', 'view_number', 'score')
                ->where('marketable', true)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'image_url' => $product->mainImage ? url('storage/' . $product->mainImage->image) : null,
                        'price' => $product->price,
                        'description' => $product->description,
                        'marketable' => $product->marketable,
                        'published_at' => $product->published_at ? Carbon::parse($product->published_at) : null,
                        'sold_number' => $product->sold_number,
                        'view_number' => $product->view_number,
                        'score' => $product->score,
                    ];
                });
        });

        return response()->json(['data' => $products]);
    }


 public function filtred_products(Request $request)
{
    // 1. شروع query برای گرفتن فقط ID ها
    $query = Product::query();

    // 1. فیلتر دسته‌بندی (با زیرمجموعه‌ها)
    if ($request->filled('category_id')) {
        $category = Category::find($request->category_id);
        if ($category) {
            $descendantIds = $category->allChildren()->pluck('id')->toArray();
            $descendantIds[] = $category->id;
            $query->whereIn('category_id', $descendantIds);
        }
    }

    // 2. فیلتر برند
    if ($request->filled('brand_id')) {
        $query->where('brand_id', $request->brand_id);
    }

    // 3. فیلتر قیمت
    if ($request->filled('min_price')) {
        $query->where('price', '>=', $request->min_price);
    }
    if ($request->filled('max_price')) {
        $query->where('price', '<=', $request->max_price);
    }

    // 4. فیلتر تخفیف‌دار
    if ($request->boolean('has_discount')) {
        $query->whereHas('amazings', function ($q) {
            $q->where('status', 1)->where('end_date', '>', now());
        });
    }

    // 5. مرتب‌سازی
    $sort = $request->input('sort', 'latest');
    switch ($sort) {
        case 'latest': $query->orderBy('created_at', 'desc'); break;
        case 'most_expensive': $query->orderBy('price', 'desc'); break;
        case 'cheapest': $query->orderBy('price', 'asc'); break;
        case 'most_views': $query->orderBy('view_number', 'desc'); break;
        case 'best_selling': $query->orderBy('sold_number', 'desc'); break;
        default: $query->orderBy('id', 'desc'); break;
    }

    // 6. صفحه‌بندی: فقط ID ها
    $perPage = 9;
    $productIds = $query->paginate($perPage)->pluck('id')->toArray();

    $products = collect();
    $missingIds = [];

    // 7. بررسی کش برای هر محصول
    foreach ($productIds as $id) {
        $cached = Cache::get("product:{$id}");
        if ($cached) {
            $products->push($cached);
        } else {
            $missingIds[] = $id;
        }
    }

    // 8. محصولات گم‌شده از دیتابیس
    if (!empty($missingIds)) {
        $dbProducts = Product::with([
            'mainImage' => function ($q) { $q->select('id', 'product_id', 'image'); },
            'amazings' => function ($q) {
                $q->where('status', 1)
                  ->where('end_date', '>', now())
                  ->select('id', 'product_id', 'amount', 'end_date')
                  ->orderBy('created_at', 'desc')
                  ->take(1);
            }
        ])->select([
            'id', 'name', 'price', 'description', 'marketable',
            'published_at', 'sold_number', 'view_number', 'score',
            'category_id', 'brand_id'
        ])->whereIn('id', $missingIds)->get();

        // ذخیره در کش و اضافه به نتیجه
        foreach ($dbProducts as $p) {
            Cache::put("product:{$p->id}", $p, now()->addHours(6)); // TTL دلخواه
            $products->push($p);
        }
    }

    // 9. مرتب‌سازی محصولات بر اساس order اصلی
    $products = $products->sortBy(function($p) use ($productIds) {
        return array_search($p->id, $productIds);
    })->values();

    // 10. فرمت خروجی
    $formattedProducts = $products->map(function ($product) {
        $activeDiscount = $product->amazings->first();
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'description' => $product->description,
            'marketable' => $product->marketable,
            'published_at' => $product->published_at ? $product->published_at : null,
            'sold_number' => $product->sold_number,
            'view_number' => $product->view_number,
            'score' => $product->score,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id,
            'image_url' => $product->mainImage ? url('storage/' . $product->mainImage->image) : null,
            'discount' => $activeDiscount ? [
                'amount' => $activeDiscount->amount,
                'end_date' => $activeDiscount->end_date,
            ] : null,
        ];
    });

    // 11. پاسخ نهایی
    return response()->json([
        'data' => $formattedProducts,
        'meta' => [
            'current_page' => 1, // میتونی $query->paginate($perPage)->currentPage() هم بگیری
            'per_page' => $perPage,
            'total' => count($productIds), 
            'filters' => $request->only(['category_id','brand_id','min_price','max_price','sort','has_discount']),
        ]
    ]);
}
    

    /**
     * لیست پرفروش‌ترین محصولات با عکس اصلی
     */
    public function top_sellers()
    {
        $products = Cache::remember('products_top_sellers', 300, function () {
            return Product::with(['mainImage' => function ($query) {
                $query->select('id', 'product_id', 'image');
            }])
                ->select('id', 'name', 'price', 'description', 'marketable', 'published_at', 'sold_number', 'view_number', 'score')
                ->where('marketable', true)
                ->orderBy('sold_number', 'desc')
                ->take(10)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'image_url' => $product->mainImage ? url('storage/' . $product->mainImage->image) : null,
                        'price' => $product->price,
                        'description' => $product->description,
                        'marketable' => $product->marketable,
                        'published_at' => $product->published_at ? Carbon::parse($product->published_at) : null,
                        'sold_number' => $product->sold_number,
                        'view_number' => $product->view_number,
                        'score' => $product->score,
                    ];
                });
        });

        return response()->json(['data' => $products]);
    }

    /**
     * لیست پربازدیدترین محصولات با عکس اصلی
     */
    public function most_viewed()
    {
        $products = Cache::remember('products_most_viewed', 300, function () {
            return Product::with(['mainImage' => function ($query) {
                $query->select('id', 'product_id', 'image');
            }])
                ->select('id', 'name', 'price', 'description', 'marketable', 'published_at', 'sold_number', 'view_number', 'score')
                ->where('marketable', true)
                ->orderBy('view_number', 'desc')
                ->take(10)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'image_url' => $product->mainImage ? url('storage/' . $product->mainImage->image) : null,
                        'price' => $product->price,
                        'description' => $product->description,
                        'marketable' => $product->marketable,
                        'published_at' => $product->published_at ? Carbon::parse($product->published_at) : null,
                        'sold_number' => $product->sold_number,
                        'view_number' => $product->view_number,
                        'score' => $product->score,
                    ];
                });
        });

        return response()->json(['data' => $products]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function add_product_to_favorites(Request $request, Product $product)
{
    try {
        // بررسی احراز هویت کاربر
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'error' => 'کاربر احراز هویت نشده است',
            ], 401);
        }

        $user = Auth::guard('api')->user();

        // بررسی اینکه آیا محصول در علاقه‌مندی‌ها وجود دارد
        $existingFavorite = Favorite::where('user_id', $user->id)
                                   ->where('product_id', $product->id)
                                   ->first();

        if ($existingFavorite) {
            // حذف محصول از علاقه‌مندی‌ها
            $existingFavorite->delete();
            $status = 'removed';
            $message = 'محصول از لیست علاقه‌مندی‌ها حذف شد';
        } else {
            // افزودن محصول به علاقه‌مندی‌ها
            Favorite::create([
                'user_id' => $user->id,
                'product_id' => $product->id,
            ]);
            $status = 'added';
            $message = 'محصول با موفقیت به لیست علاقه‌مندی‌ها اضافه شد';
        }

        // نامعتبر کردن کش اطلاعات کاربر
        Cache::forget("user:{$user->id}");

        return response()->json([
            'status' => $status,
            'message' => $message,
            'data' => [
                'user_id' => $user->id,
                'product_id' => $product->id,
            ],
        ], 200);

    } catch (\Throwable $e) {
        Log::error('Error toggling product in favorites: ' . $e->getMessage());
        return response()->json([
            'error' => 'خطا در تغییر وضعیت علاقه‌مندی محصول',
        ], 500);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
