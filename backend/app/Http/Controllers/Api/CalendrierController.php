<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarClosure;
use App\Models\CalendarEvent;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendrierController extends Controller
{
    public function month(Request $request): JsonResponse
    {
        $month = $request->query('month'); // format YYYY-MM
        if (!$month) {
            return response()->json(['errors' => ['month' => ['Paramètre month requis (YYYY-MM).']]], 422);
        }

        try {
            $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
            $end = (clone $start)->endOfMonth();
        } catch (\Exception $e) {
            return response()->json(['errors' => ['month' => ['Format invalide. Utiliser YYYY-MM.']]], 422);
        }

        $closures = CalendarClosure::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get(['date', 'reason', 'recurrence']);

        $events = CalendarEvent::query()
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->get(['date', 'title', 'description', 'capacity_multiplier']);

        return response()->json([
            'data' => [
                'month' => $month,
                'closures' => $closures,
                'events' => $events,
            ],
        ]);
    }
}



