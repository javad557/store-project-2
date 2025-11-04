<?php

namespace App\Http\Controllers\Main\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Main\User\CustomerAddressRequest;
use App\Http\Requests\Main\User\CustomerUserRequest;
use App\Models\Market\Product;
use App\Models\Profile\Address;
use App\Models\Profile\City;
use App\Models\Profile\Favorite;
use App\Models\Profile\Province;
use App\Models\PurchaseProcess\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CustomerUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function orders()
    {
         try{
            if (Auth::guard('api')->check()) {
             $user = Auth::guard('api')->user();
             $orders = Order::where('user_id',$user->id)->get();
             Log::info('orders',['orders'=>$orders]);
             return response()->json([
                'data'=>$orders,
             ],200);
        }
        else{
             return response()->json([
            'error' => 'کاربر احراز هویت نشده است',
        ], 401);
        }
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'دریافت سفارشات مورد نظر با خطا مواجه شد',
            ],500);
        }
    }



 public function my_order_items(Order $order)
{
    try {
        $order_items = $order->items()->with([
            'variant' => fn($query) => $query->select('id', 'product_id', 'color_id'),
            'variant.product' => fn($query) => $query->select('id', 'name', 'price')->with([
                'mainImage' => fn($query) => $query->select('id', 'product_id', 'image')
            ]),
            'variant.color' => fn($query) => $query->select('id', 'name')
        ])->select('id', 'order_id', 'variant_id', 'number', 'discount')->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'order_id' => $item->order_id,
                    'number' => $item->number,
                    'discount' => $item->discount,
                    'variant' => [
                        'id' => $item->variant->id,
                        'color' => [
                            'id' => $item->variant->color->id,
                            'name' => $item->variant->color->name,
                        ],
                        'product' => [
                            'id' => $item->variant->product->id,
                            'name' => $item->variant->product->name,
                            'price' => $item->variant->product->price,
                            'image' => $item->variant->product->mainImage ? url('storage/' . $item->variant->product->mainImage->image) : null,
                        ],
                    ],
                ];
            });

        return response()->json([
            'data' => $order_items,
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'دریافت آیتم‌های سفارش مورد نظر با مشکل مواجه شد.',
        ], 500);
    }
}



    /**
     * Update the specified resource in storage.
     */
    public function update(CustomerUserRequest $request)
    {
        try{
            if (Auth::guard('api')->check()) {
             $user = Auth::guard('api')->user();
             Log::info('tesst',[$user]);
             $user->update([
                'name'=>$request->name,
                'last_name' =>$request->last_name,
                'mobile' =>$request->mobile,
                'email' => $request->email,
                'national_code' =>$request->national_code,
             ]);
             return response()->json([
                'message'=>'اطلاعات مورد نظر با موفقیت ویرایش شد',
             ],200);
        }
        else{
             return response()->json([
            'error' => 'کاربر احراز هویت نشده است',
        ], 401);
        }
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'ویرایش اطلاعات مورد نظر با خطا مواجه شد',
            ],500);
        }
    }


public function my_addresses()
{
    try {
        if (Auth::guard('api')->check()) {
            $user = Auth::guard('api')->user();
            $my_addresses = $user->addresses()->with([
                'city' => fn($query) => $query->select('id', 'name'),
                'province' => fn($query) => $query->select('id', 'name'),
            ])->select('id', 'city_id', 'province_id', 'address', 'no', 'unit', 'mobile')->get()
                ->map(function ($address) use ($user) {
                    return [
                        'id' => $address->id,
                        'city' => $address->city ? [
                            'id' => $address->city->id,
                            'name' => $address->city->name,
                        ] : null,
                        'province' => $address->province ? [
                            'id' => $address->province->id,
                            'name' => $address->province->name,
                        ] : null,
                        'address' => $address->address,
                        'no' => $address->no,
                        'unit' => $address->unit,
                        'mobile' => $address->mobile ?? $user->mobile,
                    ];
                });

            return response()->json([
                'data' => $my_addresses,
                'addresses_count' => $my_addresses->count(),
            ], 200);
        } else {
            return response()->json([
                'error' => 'کاربر احراز هویت نشده است',
            ], 401);
        }
    } catch (\Throwable $e) {
        Log::error('Error fetching addresses', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'user_id' => Auth::guard('api')->id() ?? 'unknown',
        ]);
        return response()->json([
            'error' => 'دریافت آدرس‌های مورد نظر با خطا مواجه شد',
        ], 500);
    }
}


public function my_address(Address $address){
    try{
        return response()->json([
            'data'=>$address,
        ],200);
    }
    catch(\Throwable $e){
        Log::error($e->getMessage());
        return response()->json([
            'error'=>'دریافت ادرس مورد نظر با خطا مواجه شد',
        ],500);
    }
}


public function all_provinces (){
    // Log::info('all_provincestest',['allall_provinces'=>'yes']);
    try{
        $provinces = Province::all();
        return response()->json([
            'data'=>$provinces,
        ],200);

    }
    catch(\Throwable $e){
        Log::error($e->getMessage());
        return response()->json([
            'error'=>'دریافت استا های مورد نظر با خطا مواجه شد',
        ],500);
    }
}

public function all_cities (){
    //  Log::info('all_citiestest',['all_citiestest'=>'yes']);
    try{
        $cities = City::all();
        return response()->json([
            'data'=>$cities,
        ],200);
    }
    catch(\Throwable $e){
        Log::error($e->getMessage());
        return response()->json([
            'error'=>'دریافت شهر های مورد نظر با خطا مواجه شد',
        ],500);
    }
    
}

public function add_address(CustomerAddressRequest $request)
{
//   Log::info('add_address',['add_address'=>$request->all()]);
try{
    if (Auth::guard('api')->check()) {
            $user = Auth::guard('api')->user();
            Address::create([
             "province_id"=>$request->province_id,
             "city_id"=>$request->city_id,
             "address"=>$request->address,
             "postal_code"=>$request->postal_code,
             "unit"=>$request->unit,
             "mobile"=>$request->mobile,
             "no"=>$request->no,
             "user_id"=>$user->id,
         ]);

         return response()->json([
             'message'=>'ادررس مورد نظر با موفقیت افزوده شد',
         ],200);

    }
    else {
            return response()->json([
                'error' => 'کاربر احراز هویت نشده است',
            ], 401);
    }
}
catch(\Throwable $e){
    Log::error($e->getMessage());
    return response()->json([
        'error'=>'افزودن ادرس مورد نظر با خطا مواجه شد',
    ],500);
}
}


public function edit_address(Address $address,CustomerAddressRequest $request){
    try{
        $address->update([
            "province_id"=>$request->province_id,
             "city_id"=>$request->city_id,
             "address"=>$request->address,
             "postal_code"=>$request->postal_code,
             "unit"=>$request->unit,
             "mobile"=>$request->mobile,
             "no"=>$request->no,
        ]);
        return response()->json([
            'message'=>'ادرس مورد نظر با موفقیت ویرایش شد',
        ],200);
    }
    catch(\Throwable $e){
         Log::error($e->getMessage());
    return response()->json([
        'error'=>'ویرایش ادرس مورد نظر با خطا مواجه شد',
    ],500);
    }

}


public function my_favorites()
{
    try {
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'error' => 'لطفاً ابتدا وارد حساب کاربری خود شوید',
            ], 401);
        }

        $user = Auth::guard('api')->user();
        $my_favorites = $user->favorites()
            ->with([
                'product' => function ($query) {
                    $query->select('id', 'name', 'price')
                        ->with([
                            'mainImage' => function ($query) {
                                $query->select('id', 'product_id', 'image');
                            }
                        ]);
                }
            ])
            ->get()
            ->map(function ($item) use ($user) {
                return [
                    'id' => $item->id,
                    'user_id' => $user->id,
                    'product' => $item->product ? [
                        'id'=>$item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->mainImage ? url('storage/' . $item->product->mainImage->image) : null,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $my_favorites,
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'دریافت لیست علاقه‌مندی‌ها با خطا مواجه شد',
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
   public function destroy_favorite(Product $product)
{
    try {
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'error' => 'لطفاً ابتدا وارد حساب کاربری خود شوید',
            ], 401);
        }

        $user = Auth::guard('api')->user();
        
        // بررسی وجود علاقه‌مندی
        $favorite = $user->favorites()->where('product_id', $product->id)->first();
        
        if (!$favorite) {
            return response()->json([
                'error' => 'این محصول در لیست علاقه‌مندی‌های شما یافت نشد',
            ], 404);
        }

        // حذف علاقه‌مندی
        $favorite->delete();

        return response()->json([
            'message' => 'محصول مورد نظر با موفقیت از لیست علاقه‌مندی‌های شما حذف شد',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'حذف محصول از لیست علاقه‌مندی‌ها با خطا مواجه شد',
        ], 500);
    }
}



  public function destroy_address (Address $address)
{
    Log::info('deleteaddress',['deleteaddress'=>'yes']);
    try {
        $address->delete();
        return response()->json([
            'message' => 'ادرس مورد نظر با موفقیت حذف شد',
        ], 200);
    } catch (\Throwable $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'حذف ادرس مورد نظر با خطا مواجه شد',
        ], 500);
    }
}
}



