<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModelActivisionController extends Controller
{
    protected $classes = [
        'Branch' => Branch::class,
        'User' => User::class,
        'Currency' => Currency::class,
    ];
    public function Activission(Request $request): JsonResponse
    {
        $this->classes[$request->model]::where('id', $request->id)
            ->update([
                'status' => !$request->status
            ]);

        return response()->json(null, JsonResponse::HTTP_OK);
    }
}
