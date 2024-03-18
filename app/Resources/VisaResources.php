<?php

namespace App\Resources;

use App\Models\SystemInfo;
use App\Models\Till;
use App\Models\Visa;
use Illuminate\Http\JsonResponse;

class VisaResources
{
    public static function get_visa_latest_id(): JsonResponse
    {
        return response()->json(SystemInfo::whereId(1)->first()->visa_no, JsonResponse::HTTP_OK);
    }
}
