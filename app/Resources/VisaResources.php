<?php

namespace App\Resources;

use App\Models\Till;
use Illuminate\Http\JsonResponse;

class VisaResources
{
    public static function get_visa_latest_id(): JsonResponse
    {
        return response()->json((Till::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }
}
