<?php

namespace App\DomainsLogic;

use App\Actions\CustomerAccountingActions;
use App\Actions\EmployeeAccountingActions;
use App\Http\Requests\CreateCustomerRequest;
use App\Http\Requests\CreateEmployeeRequest;
use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\CustomerLedger;
use App\Models\Employee;
use App\Models\EmployeeAccount;
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

            $id = $customer->getConnection()->getPdo()->lastInsertId();

            if (!$request->is_update) {
                foreach ($request->balancies as $currency) {
                    (new CustomerAccountingActions($id))
                        ->createAccount(new CustomerAccount(), $currency['balance'], $currency['id'])
                        ->createDebitStatement('OPENING-BALANCE', (float) $currency['balance']);
                }
            }
        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }

        DB::commit();

        return response()->json(HRResources::get_customer_latest_id(), JsonResponse::HTTP_OK);
    }

    public static function add_employee(CreateEmployeeRequest $request): JsonResponse
    {

        DB::beginTransaction();

        try {

            $employee = $request->is_update ? Employee::find($request->Employee_id) :  new Employee();
            $employee->setData((object) $request->all())->save();

            $id = $employee->getConnection()->getPdo()->lastInsertId();

            if (!$request->is_update) {
                foreach ($request->balancies as $currency) {
                    (new EmployeeAccountingActions($id))
                        ->createAccount(new EmployeeAccount(), $currency['balance'], $currency['id'])
                        ->createDebitStatement('OPENING-BALANCE', (float) $currency['balance']);
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
