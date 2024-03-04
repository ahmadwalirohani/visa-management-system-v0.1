<?php
namespace App\Resources;

use App\Models\Branch;
use Illuminate\Http\JsonResponse;

class SettingResources
{
    public static function get_branches(): JsonResponse
    {
        return response()->json(Branch::all(),200);
    }
}
