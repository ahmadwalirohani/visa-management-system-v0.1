<?php

namespace App\Resources;

use App\Models\Customer;
use App\Models\CustomerAccount;
use App\Models\CustomerLedger;
use App\Models\Employee;
use App\Models\EmployeeLedger;
use App\Models\Payroll;
use App\Models\Visa;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HRResources
{
    public static function get_customer_latest_id(): JsonResponse
    {
        return response()->json((Customer::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }

    public static function get_customers(): JsonResponse
    {
        return response()->json(Customer::withBranch()->withBalancies()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_customers_as_items(): JsonResponse
    {
        return response()->json(Customer::asItem()->withBalancies()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_employee_latest_id(): JsonResponse
    {
        return response()->json((Employee::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }

    public static function get_employees(): JsonResponse
    {
        return response()->json(Employee::withBranch()->withBalancies()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_customer_ledger(object $payload): JsonResponse
    {
        return response()->json(
            $payload->is_paginate ?
                CustomerLedger::filter($payload)->getLedgerRelations()->orderByDesc('created_at')->paginate(50)
                : [
                    "ledger" => CustomerLedger::filter($payload)->getLedgerRelations()->orderByDesc('created_at')->get(),
                    "balance" => CustomerAccount::whereCustomerId($payload->cu)->whereCurrencyId($payload->c[0])->first(),
                    "visa_totals" => Visa::whereCustomerId($payload->cu)->whereCurrencyId($payload->c[0])->select(DB::raw('SUM(price) as total_amount, COUNT(id) as total_visa'))->get()
                ],
            JsonResponse::HTTP_OK
        );
    }

    public static function get_employee_ledger(object $payload): JsonResponse
    {
        return response()->json(
            $payload->is_paginate ?
                EmployeeLedger::filter($payload)->getLedgerRelations()->orderByDesc('created_at')->paginate(50)
                : EmployeeLedger::filter($payload)->getLedgerRelations()->orderByDesc('created_at')->get(),
            JsonResponse::HTTP_OK
        );
    }

    public static function get_payrolls(): JsonResponse
    {
        return response()->json(
            Payroll::withDetails()->paginate(50),
            200
        );
    }
}
