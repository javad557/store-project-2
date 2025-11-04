<?php

namespace App\Http\Controllers\Main\Marketing;

use App\Http\Controllers\Controller;
use App\Models\Marketing\Banner;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    // Log::alert('assettest',['assettest'=>url('storage')]);
    $banners = Cache::remember('banners', 300, function () {
        return Banner::select('image', 'url', 'title', 'position')
            ->get()
            ->map(function ($banner) {
                return [
                    'position' => $banner->position,
                    'url' => $banner->url,
                    'title' => $banner->title,
                    'image' => url('storage/' . $banner->image), // یا Storage::url($banner->image)
                ];
            });
    });

    return response()->json(['data' => $banners]);
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
