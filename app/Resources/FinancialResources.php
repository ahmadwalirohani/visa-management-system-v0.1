<?php

namespace App\Resources;

use App\Models\Bank;
use App\Models\Customer;
use App\Models\EICodes;
use App\Models\Employee;
use App\Models\JournalEntry;
use App\Models\Till;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Morilog\Jalali\Jalalian;

class FinancialResources
{
    public static function get_till_latest_id(): JsonResponse
    {
        return response()->json((Till::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }

    public static function get_tills(): JsonResponse
    {
        return response()->json(Till::withBalancies()->withBranch()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_bank_latest_id(): JsonResponse
    {
        return response()->json((Bank::latest()->first() ?? (object) ['id' => 0])->id + 1, JsonResponse::HTTP_OK);
    }

    public static function get_banks(): JsonResponse
    {
        return response()->json(Bank::withBalancies()->withBranch()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_till_accounts(): JsonResponse
    {
        return response()->json(Till::withBalancies()->whereStatus(true)->get(['id', 'branch_id', 'name as label', 'code']), JsonResponse::HTTP_OK);
    }

    public static function get_bank_accounts(): JsonResponse
    {
        return response()->json(Bank::withBalancies()->whereStatus(true)->get(['id', 'branch_id', 'name as label', 'code']), JsonResponse::HTTP_OK);
    }

    public static function get_customer_accounts(): JsonResponse
    {
        return response()->json(Customer::withBalancies()->whereStatus(true)->get(['id', 'branch_id', 'name as label', 'code']), JsonResponse::HTTP_OK);
    }
    public static function get_income_accounts(): JsonResponse
    {
        return response()->json(EICodes::whereType('INCOME')->whereStatus(true)->get(['id',  'name as label', 'code']), JsonResponse::HTTP_OK);
    }

    public static function get_employee_accounts(): JsonResponse
    {
        return response()->json(Employee::withBalancies()->whereStatus(true)->get(['id', 'branch_id', 'name as label', 'code']), JsonResponse::HTTP_OK);
    }

    public static function get_expense_accounts(): JsonResponse
    {
        return response()->json(EICodes::whereType('EXPENSE')->whereStatus(true)->get(['id', 'name as label', 'code']), JsonResponse::HTTP_OK);
    }

    public static function get_journal_entries(object $payload): JsonResponse
    {

        return response()->json(
            $payload->is_paginate == true ? JournalEntry::getJournalRelations()
                ->filter($payload)
                ->orderByDesc('created_at')
                ->paginate(50) : JournalEntry::getJournalRelations()
                ->filter($payload)
                ->orderByDesc('created_at')
                ->get(),
            JsonResponse::HTTP_OK
        );
    }
}
