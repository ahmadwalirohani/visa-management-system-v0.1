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
use App\Models\Payroll;
use App\Models\PayrollDetails;
use App\Resources\HRResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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

            UsersLogics::create_user_record(
                $request->branch,
                $request->is_update ? 'مشتري تغیر' : 'نوی مشتري اضافه',
                $customer->name,
            );
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

            UsersLogics::create_user_record(
                $request->branch,
                $request->is_update ? 'کارمند تغیر' : 'نوی کارمند اضافه',
                $employee->name,
            );
        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }

        DB::commit();

        return response()->json(HRResources::get_customer_latest_id(), JsonResponse::HTTP_OK);
    }

    public static function add_payroll_sheet(Request $request): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|string|min:10|max:10',
            'end_date' => 'required|string|min:10|max:10',
            'currency' => 'required|numeric|min:1',
            'working_days' => 'required|numeric|min:1',
            'sheet' => 'required|array',
        ]);

        DB::beginTransaction();

        try {

            $payroll = (new Payroll())->setData((object)[
                'start_date' => $request->start_date,
                'currency' => $request->currency,
                'end_date' => $request->end_date,
                'remarks' => $request->remarks,
                'working_days' => $request->working_days,
            ]);
            $payroll->save();

            foreach ($request->sheet as $employee) {
                $employee = (object) $employee;

                (new PayrollDetails())->setData((object)[
                    'absence' => $employee->absence,
                    'employee_id' => $employee->id,
                    'payroll_id' => $payroll->id,
                    'presence' => $employee->presense,
                    'salary' => $employee->salary,
                    'tax' => $employee->tax,
                    'overtime' => $employee->overtime,
                    'net_salary' => floatval($employee->net_salary),
                ])->save();

                (new EmployeeAccountingActions($employee->id))
                    ->creditAccount(
                        $request->currency,
                        floatval($employee->net_salary),
                    )
                    ->createCreditStatement(
                        'SALARY-CREDIT',
                        floatval($employee->net_salary),
                        null,
                        '',
                        $request->currency,
                        0,
                        0,
                    );
            }

            UsersLogics::create_user_record(
                $request->branch,
                'کارمندانو معاشاتو توزیع',
                'Payroll Start Date : ' . $request->start_date . ' and to :' . $request->end_date
            );
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], 200);
    }
}
