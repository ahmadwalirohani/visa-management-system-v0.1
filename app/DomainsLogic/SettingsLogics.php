<?php

namespace App\DomainsLogic;

use App\Http\Requests\CreateBranchRequest;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
