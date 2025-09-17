<?php

namespace App\Http\Controllers\Admin\Market;

use App\Helpers\ColorHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Market\VariantManagementRequest;
use App\Http\Requests\Market\VariantRequest;
use App\Models\Market\NameHax;
use App\Models\Market\Product;

use App\Models\Market\ProductColor;
use App\Models\Market\Variant;
use App\Models\Market\VariantValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class VariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */

     public function index(Product $product)
    {
        try {
            // لود کردن واریانت‌ها، مقادیر واریانت‌ها و رنگ‌ها
            $product->load('variants.Values', 'variants.color');
            $variants = $product->variants;

            // استخراج نام‌های ستون‌های دینامیک (attributes) از اولین واریانت
            $attributeColumns = $variants->isNotEmpty()
                ? $variants->first()->Values->pluck('attribute')->unique()->values()->toArray()
                : [];

            // جمع‌آوری داده‌های واریانت‌ها
            $variantData = $variants->map(function ($variant) use ($attributeColumns) {
                $attributes = [];
                foreach ($variant->Values as $variantValue) {
                    $attributes[$variantValue->attribute] = $variantValue->value;
                }

                // دریافت کد هگز رنگ از جدول name_hax
                $hexColor = $variant->color
                    ? NameHax::where('name', $variant->color->name)->value('hax') ?? '#000000'
                    : '#000000';

                return [
                    'id' => $variant->id,
                    'product_id' => $variant->product_id,
                    'color' => $variant->color ? $variant->color->name : null,
                    'hex_color' => $hexColor,
                    'freezed_number' => $variant->freezed_number ?? false,
                    'number' => $variant->number,
                    'price_increase' => $variant->price_increase ?? 0, // اضافه کردن price_increase
                    'attributes' => $attributes,
                ];
            });

            Log::info('واریانت‌ها', [
                'product_id' => $product->id,
                'variants' => $variantData->toArray(),
                'attribute_columns' => $attributeColumns,
                'product_image' => $product->image
            ]);

            return response()->json([
                'variants' => $variantData,
                'product_name' => $product->name,
                'product_image' => $product->image ? asset($product->image) : null,
                'attribute_columns' => $attributeColumns
            ], 200);
        } catch (\Exception $e) {
            Log::error('خطا در دریافت واریانت‌ها', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'error' => 'خطایی در دریافت واریانت‌های محصول رخ داد: ' . $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Store a newly created resource in storage.
     */
 public function store(VariantManagementRequest $request, Product $product)
    {
        Log::info('ورودی', ['ورودی' => $request->all()]);

        try {
            DB::beginTransaction();

            if ($request->action === 'delete') {
                $combinations = $request->input('combinations', []);
                foreach ($combinations as $combination) {
                    // دریافت color_id
                    $colorIds = ColorHelper::detectColor($combination['color']);
                    $colorId = $colorIds[0] ?? null;

                    if (!$colorId) {
                        throw new \Exception("خطا در تشخیص رنگ: {$combination['color']}");
                    }

                    // پیدا کردن همه واریانت‌ها با product_id و color_id
                    $variants = Variant::where('product_id', $product->id)
                        ->where('color_id', $colorId)
                        ->get();

                    if ($variants->isEmpty()) {
                        continue; // اگر واریانتی پیدا نشد، به ترکیب بعدی برو
                    }

                    // ویژگی‌های ارسالی
                    $inputAttributes = $combination['attribute'];

                    foreach ($variants as $variant) {
                        // بررسی وجود حداقل یکی از ویژگی‌های ارسالی در variant_values
                        $attributeMatchFound = false;
                        foreach ($inputAttributes as $attribute => $value) {
                            $exists = VariantValue::where('variant_id', $variant->id)
                                ->where('attribute', $attribute)
                                ->where('value', $value)
                                ->exists();

                            if ($exists) {
                                $attributeMatchFound = true;
                                break; // اگر حداقل یک ویژگی مطابقت داشت، کافی است
                            }
                        }

                        // اگر حداقل یک ویژگی مطابقت داشت، number را به 999 تغییر بده
                        if ($attributeMatchFound) {
                            $variant->update(['number' => 999]);
                        }
                    }
                }

                DB::commit();
                return response()->json(['message' => 'واریانت‌ها با موفقیت به‌روزرسانی شدند.']);
            }

            // پردازش combinations برای action=add (بدون تغییر)
            $combinations = $request->input('combinations', []);
            foreach ($combinations as $combination) {
                // دریافت یا ایجاد color_id
                $colorIds = ColorHelper::detectColor($combination['color']);
                $colorId = $colorIds[0] ?? null;

                if (!$colorId) {
                    throw new \Exception("خطا در تشخیص یا ایجاد رنگ: {$combination['color']}");
                }

                // بررسی وجود واریانت با product_id و color_id
                $variant = Variant::where('product_id', $product->id)
                    ->where('color_id', $colorId)
                    ->first();

                if ($variant) {
                    // دریافت تمام ویژگی‌های موجود برای این واریانت
                    $existingAttributes = VariantValue::where('variant_id', $variant->id)
                        ->get(['attribute', 'value'])
                        ->mapWithKeys(function ($item) {
                            return [$item->attribute => $item->value];
                        })->toArray();

                    // ویژگی‌های ارسالی
                    $inputAttributes = $combination['attribute'];

                    // مقایسه ویژگی‌ها
                    $attributesMatch = true;
                    if (count($existingAttributes) !== count($inputAttributes)) {
                        $attributesMatch = false;
                    } else {
                        foreach ($inputAttributes as $attribute => $value) {
                            if (!isset($existingAttributes[$attribute]) || $existingAttributes[$attribute] !== $value) {
                                $attributesMatch = false;
                                break;
                            }
                        }
                    }

                    // اگر ویژگی‌ها دقیقاً یکسان بودند، ادامه بده به ترکیب بعدی
                    if ($attributesMatch) {
                        continue;
                    }
                }

                // ایجاد واریانت جدید (اگر واریانت وجود نداشت یا ویژگی‌ها متفاوت بودند)
                $variant = Variant::create([
                    'product_id' => $product->id,
                    'color_id' => $colorId,
                    'price_increase' => $combination['price_increase'],
                    'number' => $combination['value'],
                    'freezed_number' => 0,
                ]);

                // اضافه کردن ویژگی‌ها به variant_values
                foreach ($combination['attribute'] as $attribute => $value) {
                    VariantValue::create([
                        'variant_id' => $variant->id,
                        'attribute' => $attribute,
                        'value' => $value,
                    ]);
                }
            }

            // ذخیره ترکیب‌های غیرمجاز (در صورت نیاز)
            $forbiddenCombinations = $request->input('forbiddenCombinations', []);
            Log::info('ترکیب‌های غیرمجاز:', ['forbiddenCombinations' => $forbiddenCombinations]);

            DB::commit();
            return response()->json(['message' => 'واریانت‌ها با موفقیت ذخیره شدند.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('خطا در ذخیره یا به‌روزرسانی واریانت‌ها:', ['error' => $e->getMessage()]);
            return response()->json(['errors' => ['خطا در ذخیره یا به‌روزرسانی واریانت‌ها: ' . $e->getMessage()]], 500);
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
  public function update(Request $request, Variant $variant)
    {
        try {
            // پیدا کردن واریانت
            Log::info('واریانت مورد نظر', ['واریانت مورد نظر'=>$variant]);

            // بررسی freezed_number
            if ($variant->freezed_number > 0 && $request->freezed_number > 0) {
                return response()->json([
                    'message' => 'برای واریانت مورد نظر سفارش فعال وجود دارد',
                ], 422);
            }

            // تشخیص رنگ و دریافت ID رنگ
            $colorIds = ColorHelper::detectColor($request['color']);
            //   Log::info('ایدی رنگ مورد نظر', ['ایدی رنگ مورد نظر'=>$colorIds]);
            $colorId = $colorIds[0] ?? null; // فرض می‌کنیم فقط یک رنگ داریم

            if (!$colorId) {
                return response()->json([
                    'message' => 'خطا در پردازش رنگ',
                ], 422);
            }

            // به‌روزرسانی واریانت
            $variant->update([
                'color_id' => $colorId,
                'number' => $request['number'],
                'freezed_number' => $request['freezed_number'],
                // اگر ستون color_id توی جدول variants دارید، می‌تونید این رو اضافه کنید
                // 'color_id' => $colorId,
            ]);

            // حذف رکوردهای قبلی در جدول variant_values
            VariantValue::where('variant_id', $variant->id)->delete();

            // ایجاد رکوردهای جدید برای attributes در جدول variant_values
            foreach ($request['attributes'] as $attribute => $value) {
                VariantValue::create([
                    'variant_id' => $variant->id,
                    'attribute' => $attribute,
                    'value' => $value,
                ]);
            }

            return response()->json([
                'message' => 'واریانت با موفقیت ویرایش شد',
                'variant' => $variant->load('values'), // بارگذاری رابطه variant_values
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'ویرایش واریانت با خطا مواجه شد',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Variant $variant)
    {
        try{
             $variant->update([
            'number'=>999
           ]);
           return response()->json([
            'message'=>'واریانت مورد نظر از حالت فروش مستقیم خارج شد'
           ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حذف واریانت با خطا مواجه شد',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
