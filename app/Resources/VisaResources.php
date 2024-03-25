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

    public static function get_pending_visas(object $payload): JsonResponse
    {

        return response()->json(
            Visa::getPending()
                ->filter($payload)
                ->withCustomer()
                ->withCurrency()
                ->withType()
                ->withEntranceType()
                ->orderByDesc("created_at")
                ->paginate(50),
            JsonResponse::HTTP_OK
        );
    }

    public static function get_non_processed_visas(object $payload): JsonResponse
    {
        return response()->json(
            Visa::withCustomer()
                ->withType()
                ->withBranch()
                ->getNonProcessed()
                ->withExpenses()
                ->withCurrency()
                ->get(),
            JsonResponse::HTTP_OK
        );
    }
}
