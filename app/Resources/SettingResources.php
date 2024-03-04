<?php

namespace App\Resources;

use App\Models\Branch;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class SettingResources
{
    public static function get_branches(): JsonResponse
    {
        return response()->json(Branch::all(), 200);
    }

    public static function get_users(): JsonResponse
    {
        return response()->json(User::all(), JsonResponse::HTTP_OK);
    }

    public static function get_currencies(): JsonResponse
    {
        return response()->json(Currency::all(), JsonResponse::HTTP_OK);
    }
}
