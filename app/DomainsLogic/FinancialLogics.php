<?php

namespace App\DomainsLogic;

use App\Actions\TillActions;
use App\Http\Requests\CreateTillRequest;
use App\Models\Till;
use App\Models\TillAccount;
use App\Resources\FinancialResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class FinancialLogics
{
    public static function add_till(CreateTillRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $till = $request->is_update ? Till::find($request->till_id) : new Till();
            $till->setData((object) $request->all())->save();

            if (!$request->is_update) {
                foreach ($request->balancies as $currency) {
                    $currency = (object) $currency;

                    (new TillActions($till->id))->createAccount(
                        new TillAccount(),
                        $currency->balance,
                        $currency->id,
                    )
                        ->createOpeningStatement(
                            'OPENING-BALANCE',
                            (float) $currency->balance,
                        );
                }
            }
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json(FinancialResources::get_till_latest_id(), JsonResponse::HTTP_OK);
    }
}
