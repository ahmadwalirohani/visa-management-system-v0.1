<?php

namespace App\Resources;

use App\Models\Customer;
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
}
