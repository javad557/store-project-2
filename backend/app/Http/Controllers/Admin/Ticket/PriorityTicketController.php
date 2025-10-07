<?php

namespace App\Http\Controllers\Admin\Ticket;

use App\Http\Controllers\Controller;
use App\Models\support\PriorityTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PriorityTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $priority_tickets = PriorityTicket::all();
            return response()->json([
                'data' => $priority_tickets,
                'message' => 'اولویت‌ها با موفقیت دریافت شدند',
            ], 200);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'دریافت اولویت‌های تیکت با خطا مواجه شد',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function add_priority_ticket(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            PriorityTicket::create([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'اولویت تیکت با موفقیت افزوده شد',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'خطای اعتبارسنجی',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'افزودن اولویت تیکت با خطا مواجه شد',
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update_priority_tcicket(Request $request, PriorityTicket $priority_ticket)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $priority_ticket->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'اولویت تیکت با موفقیت به‌روزرسانی شد',
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'خطای اعتبارسنجی',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'به‌روزرسانی اولویت تیکت با خطا مواجه شد',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PriorityTicket $priority_ticket)
    {
        try {
            $priority_ticket->delete();
            return response()->json([
                'message' => 'اولویت تیکت با موفقیت حذف شد',
            ], 200);
        } catch (\Throwable $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => 'حذف اولویت تیکت با خطا مواجه شد',
            ], 500);
        }
    }
}