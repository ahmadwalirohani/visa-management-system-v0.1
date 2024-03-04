<?php

namespace App\DomainsLogic;

use App\Http\Requests\CreateBranchRequest;
use App\Http\Requests\CreateCurrencyRequest;
use App\Models\Branch;
use App\Models\Currency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsLogics
{
    public function __construct()
    {
    }

    public static function add_branch(CreateBranchRequest $request): JsonResponse
    {
        if (!$request->is_update)
            Branch::create($request->all());
        else Branch::whereId($request->branch_id)->update([
            "name" => $request->name,
            "admin" => $request->admin,
            "address" => $request->address,
        ]);

        return response()->json([true], 200);
    }

    public static function set_branch_to_main(Request $request): JsonResponse
    {
        $request->validate([
            'branch_id' => 'required|numeric|gt:0'
        ]);

        DB::update('UPDATE branches SET is_main = 0 WHERE is_main = 1 ');

        Branch::query()->whereId($request->branch_id)->update([
            'is_main' => 1
        ]);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function add_currency(CreateCurrencyRequest $request): JsonResponse
    {
        if (!$request->is_update)
            Currency::create($request->all());
        else Currency::whereId($request->currency_id)->update([
            "name" => $request->name,
            "symbol" => $request->symbol,
        ]);

        return response()->json([true], 200);
    }

    public static function set_currency_to_default(Request $request): JsonResponse
    {
        $request->validate([
            'currency_id' => 'required|numeric|gt:0'
        ]);

        DB::update('UPDATE currencies SET is_default = 0 WHERE is_default = 1 ');

        Currency::query()->whereId($request->currency_id)->update([
            'is_default' => 1
        ]);

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
