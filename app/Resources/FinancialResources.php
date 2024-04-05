<?php

namespace App\Resources;

use App\Models\Bank;
use App\Models\Customer;
use App\Models\EICodes;
use App\Models\Employee;
use App\Models\JournalEntry;
use App\Models\Till;
use App\Models\TillOpeningClosing;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
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

    public static function get_journal_balancies(object $payload): JsonResponse
    {
        //
        return response()->json(
            [
                "old_balancies" => false,

            ],
            JsonResponse::HTTP_OK
        );
    }

    public static function get_till_opening_close(object $payload): JsonResponse
    {
        $report = TillOpeningClosing::withBalancies()->whereClosedDate(null)->whereTillId($payload->id)->latest('id')->first();
        foreach ($report->balancies as $balance) {
            $balance->credit_amount = JournalEntry::whereTillId($report->till_id)
                ->whereBetween(DB::raw('DATE(created_at)'), [
                    substr($report->opened_date, 0, 10),
                    substr(now(), 0, 10)
                ])
                ->whereCurrencyId($balance->currency_id)
                ->sum('credit_amount');
            $balance->debit_amount = JournalEntry::whereTillId($report->till_id)
                ->whereBetween(DB::raw('DATE(created_at)'), [
                    substr($report->opened_date, 0, 10),
                    substr(now(), 0, 10)
                ])
                ->whereCurrencyId($balance->currency_id)
                ->sum('debit_amount');
        }
        return response()->json(
            $report,
            JsonResponse::HTTP_OK
        );
    }
}
