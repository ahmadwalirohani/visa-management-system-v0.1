<?php

namespace App\DomainsLogic;

use App\Actions\VisaActions;
use App\Http\Requests\CreateVisaRequest;
use App\Models\Visa;
use Illuminate\Http\JsonResponse;
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
}
