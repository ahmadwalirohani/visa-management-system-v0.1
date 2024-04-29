<?php

namespace App\Resources;

use App\Enums\VisaStatus;
use App\Models\SystemInfo;
use App\Models\Till;
use App\Models\Visa;
use App\Models\VisaCommit;
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

    public static function get_un_committed_visas(): JsonResponse
    {
        return response()->json(
            Visa::withType()
                ->withEntranceType()
                ->whereStatus(VisaStatus::COMPLETED)
                ->select([
                    'id',
                    'branch_id',
                    'customer_id',
                    'type_id',
                    'entrance_type_id',
                    'visa_no',
                    'name',
                    'passport_no'
                ])
                ->get(),
            JsonResponse::HTTP_OK
        );
    }

    public static function get_commited_visa_report(): JsonResponse
    {

        return response()->json(
            VisaCommit::withCommitedVisas()
                ->withCustomer()
                ->orderByDesc('created_at')
                ->get(),
            200
        );
    }
}
