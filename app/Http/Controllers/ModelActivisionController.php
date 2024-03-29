<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Branch;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\EICodes;
use App\Models\Employee;
use App\Models\Till;
use App\Models\User;
use App\Models\UserPrivilegeBranches;
use App\Models\VisaSubType;
use App\Models\VisaType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModelActivisionController extends Controller
{
    protected $classes = [
        'Branch' => Branch::class,
        'User' => User::class,
        'Currency' => Currency::class,
        'ExpenseIncomeCode' => EICodes::class,
        'UserPrivilegeBranch' => UserPrivilegeBranches::class,
        'VisaType' => VisaType::class,
        'VisaSubType' => VisaSubType::class,
        'Customer' => Customer::class,
        'Till' => Till::class,
        'Bank' => Bank::class,
        'Employee' => Employee::class,
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
