<?php

namespace App\Resources;

use App\Models\Branch;
use App\Models\Currency;
use App\Models\EICodes;
use App\Models\ExchangeRates;
use App\Models\SystemInfo;
use App\Models\User;
use App\Models\UserPrivilegeBranches;
use App\Models\VisaType;
use Illuminate\Http\JsonResponse;

class SettingResources
{
    public static function get_branches(): JsonResponse
    {
        return response()->json(Branch::all(), 200);
    }

    public static function get_users(): JsonResponse
    {
        return response()->json(User::withPrivilegeBranches()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_currencies(): JsonResponse
    {
        return response()->json(Currency::all()->each(function ($currency) {
            $Rate = ExchangeRates::whereCurrencyId($currency->id)->latest('id')->first() ?? (object) ['amount' => 1, "rate" => 1];
            $currency->rate = $Rate->rate;
            $currency->amount = $Rate->amount;
        }), JsonResponse::HTTP_OK);
    }

    public static function get_expense_income_codes(): JsonResponse
    {
        return response()->json(EICodes::all(), JsonResponse::HTTP_OK);
    }

    public static function get_user_privilege_branches(object | array $payload): JsonResponse
    {
        return response()->json(
            UserPrivilegeBranches::whereUserId($payload->userId)->withBranch()->get(),
            JsonResponse::HTTP_OK
        );
    }

    public static function get_visa_types(): JsonResponse
    {
        return response()->json(VisaType::withEntranceTypes()->get(), JsonResponse::HTTP_OK);
    }

    public static function get_system_infos(): JsonResponse
    {
        return response()->json(SystemInfo::find(1), JsonResponse::HTTP_OK);
    }

    public static function get_latest_exchange_rates(): JsonResponse
    {
        return response()->json(
            ExchangeRates::getLatest()->get(),
            JsonResponse::HTTP_OK
        );
    }
}
