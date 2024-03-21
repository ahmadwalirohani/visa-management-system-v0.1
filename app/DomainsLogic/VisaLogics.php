<?php

namespace App\DomainsLogic;

use App\Actions\VisaActions;
use App\Http\Requests\CreateVisaRequest;
use App\Models\Visa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisaLogics
{


    public static function create_new_visa(CreateVisaRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            (new VisaActions(new Visa()))
                ->createNewVisa(
                    (object)([
                        "visa_entrance_type" => $request->visa_entrance_type['id'],
                        "customer" => $request->customer['id'],
                        "branch" => $request->customer['branch_id'],
                    ] + $request->all())
                )
                ->creditAdvanceVisaPayment(
                    $request->till,
                    $request->currency,
                    $request->advance_amount,
                    $request->customer['id'],
                    $request->premarks,
                )
                ->updateVisaNo();
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function edit_visa(CreateVisaRequest $request): JsonResponse
    {
        (new VisaActions(new Visa()))
            ->editVisa(
                (object)([
                    "visa_entrance_type" => $request->visa_entrance_type['id'],
                    "customer" => $request->customer['id'],
                    "branch" => $request->customer['branch_id'],
                ] + $request->all())
            );
        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function book_visa_status(Request $request): JsonResponse
    {

        VisaActions::bookedVisaStatus($request->visa_id, $request->booked_date);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function order_visa_status(Request $request): JsonResponse
    {
        $request->validate([
            'visa_id' => 'required|numeric|min:1',
            'expenses' => 'required|array',
        ]);

        DB::beginTransaction();

        try {

            (new VisaActions(new Visa()))
                ->orderedVisaStatus($request->visa_id)
                ->addVisaExpenses((object) $request->expenses);
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function cancel_visa(Request $request): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string',
            'visa_id' => 'required|numeric|min:1',
        ]);

        VisaActions::cancelVisa($request->visa_id, $request->reason);

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
