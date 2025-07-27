<?php

namespace App\Helpers;
use App\Models\Market\ProductColor;
use Illuminate\Support\Facades\Log;


class ColorHelper
{
    public static function detectColor($colors)
    {
       
        $colorIds = [];
        $colors = is_array($colors) ? $colors : [$colors];

        
        foreach ($colors as $color) {
            $existingColor = ProductColor::where('name', $color)->first();
            if ($existingColor) {
                 Log::info('تست وجود', ['تست وجود'=>$color]);
                $colorIds[] = $existingColor->id;
            } else {
                Log::info('تست وجود', ['تست عدم وجود'=>$color]);
                $newColor = ProductColor::create(['name' => $color]);
                $colorIds[] = $newColor->id;
            }
        }
         Log::info('تست رنگها', ['تست رنگها'=>$colorIds]);
        return $colorIds;
    }
}