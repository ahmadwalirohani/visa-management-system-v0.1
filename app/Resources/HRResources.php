<?php

namespace App\Resources;

use App\Models\Customer;
use App\Models\CustomerLedger;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;

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
                : CustomerLedger::filter($payload)->getLedgerRelations()->orderByDesc('created_at')->get(),
            JsonResponse::HTTP_OK
        );
    }
}
