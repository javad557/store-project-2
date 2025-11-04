<?php

namespace App\Http\Controllers\Main\Market;

use App\Http\Controllers\Controller;
use App\Models\Market\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
   public function index()
{
    try {
        $categories = Category::with('allChildren')
            ->where('parent_id', null)
            ->get();

        return response()->json([
            'data' => $categories
        ], 200);
    } catch (\Throwable $e) {
        Log::error('Category index error: ' . $e->getMessage());
        return response()->json([
            'error' => 'دریافت دسته‌بندی‌ها با خطا مواجه شد'
        ], 500);
    }
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
