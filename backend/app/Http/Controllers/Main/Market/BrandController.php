<?php

namespace App\Http\Controllers\Main\Market;

use App\Http\Controllers\Controller;
use App\Models\Market\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Log::info('brandtest',['brandtest'=>'yes']);
        try{
            $brands = Brand::all();
            return response()->json([
                'data'=>$brands,
            ],200);
        }
        catch(\Throwable $e){
            Log::error($e->getMessage());
            return response()->json([
                'error'=>'دریافت برندهای مورد نظر با خطا مواجه شد',
            ],500);
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
