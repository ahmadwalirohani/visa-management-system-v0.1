<?php

namespace App\DomainsLogic;

use App\Actions\CustomerAccountingActions;
use App\Http\Requests\CreateCustomerRequest;
use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\CustomerLedger;
use App\Resources\HRResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HRLogics
{

    public static function add_customer(CreateCustomerRequest $request): JsonResponse
    {

        DB::beginTransaction();

        try {

            $customer = $request->is_update ? Customer::find($request->customer_id) :  new Customer();
            $customer->setData((object) $request->all())->save();

            if (!$request->is_update) {


                $id = $customer->getConnection()->getPdo()->lastInsertId();

                foreach ($request->balancies as $currency) {
                    (new CustomerAccountingActions($id))
                        ->createAccount(new CustomerAccount(), $currency['balance'], $currency['id'])
                        ->createDebitStatement(new CustomerLedger(), 'OPENING-BALANCE', (float) $currency['balance']);
                }
            }
        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }

        DB::commit();

        return response()->json(HRResources::get_customer_latest_id(), JsonResponse::HTTP_OK);
    }
}
