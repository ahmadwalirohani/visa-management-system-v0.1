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

    public static function get_processed_visas(object $payload): JsonResponse
    {
        return response()->json(
            Visa::withCustomer()
                ->withType()
                ->withBranch()
                ->getProcessed()
                ->withExpenses()
                ->withCurrency()
                ->get(),
            JsonResponse::HTTP_OK
        );
    }

    public static function get_proceed_visa_report(object $payload): JsonResponse
    {
        return response()->json(
            Visa::getProcessed()
                ->filter($payload)
                ->withCustomer()
                ->withCurrency()
                ->withType()
                ->withBranch()
                ->withEntranceType()
                ->withHistory()
                ->orderByDesc("created_at")
                ->when($payload->is_show_other_branches_data == false, function ($query) use ($payload) {
                    $query->whereBranchId($payload->branch_id);
                })
                ->paginate(50),
            JsonResponse::HTTP_OK
        );
    }
}
