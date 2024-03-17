<?php

namespace App\Resources;

use App\Models\Till;
use Illuminate\Http\JsonResponse;

class FinancialResources
{
    public static function get_till_latest_id(): JsonResponse
    {
        return response()->json((Till::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }

    public static function get_tills(): JsonResponse
    {
        return response()->json(Till::withBalancies()->withBranch()->get(), JsonResponse::HTTP_OK);
    }
}
