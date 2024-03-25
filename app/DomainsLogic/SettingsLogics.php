<?php

namespace App\DomainsLogic;

use App\Http\Requests\CreateBranchRequest;
use App\Http\Requests\CreateCurrencyRequest;
use App\Http\Requests\CreateEICodeRequest;
use App\Http\Requests\CreateVisaTypeEntranceRequest;
use App\Http\Requests\CreateVisaTypeRequest;
use App\Models\Branch;
use App\Models\Currency;
use App\Models\EICodes;
use App\Models\ExchangeRates;
use App\Models\SystemInfo;
use App\Models\VisaSubType;
use App\Models\VisaType;
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

    public static function add_expense_income_code(CreateEICodeRequest $request): JsonResponse
    {
        if (!$request->is_update)
            EICodes::create($request->all());
        else EICodes::whereId($request->eicode_id)->update([
            "name" => $request->name,
            "type" => $request->type,
            "code" => $request->code,
        ]);

        return response()->json([true], 200);
    }

    public static function add_visa_type(CreateVisaTypeRequest $request): JsonResponse
    {

        ($request->is_update ? VisaType::find($request->type_id) : new VisaType())
            ->setData($request->all())->save();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function add_visa_type_entrance(CreateVisaTypeEntranceRequest $request): JsonResponse
    {
        ($request->is_update ? VisaSubType::find($request->type_id) : new VisaSubType())
            ->setData((object) $request->all())->save();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function update_system_info(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "company_name" => "required|string|max:255",
            "company_email" => "required|email|string",
            "company_ceo" => "required|string|max:255",
            "company_address" => "required|string|max:255",
            "visa_no" => "required|numeric|min:1",
            "voucher_no" => "required|numeric",
            "payment_no" => "required|numeric",
        ]);

        $imageName = null;
        if ($request->hasFile("company_logo")) {
            $uploadedImage = $request->file('company_logo');
            $imageName = uniqid('image_') . '.' . $uploadedImage->getClientOriginalExtension();
            //$uploadedImage->storeAs('user_images', $imageName, 'public');
            $request->file("company_logo")->move("user_images", $imageName);
        }

        SystemInfo::whereId(1)->update($validated);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function add_currency_exchange_rates(Request $request): JsonResponse
    {
        $defaultCurrency = Currency::getDefault()->first()->id;
        foreach ($request->rates as $currency) {
            $currency = (object) $currency;

            (new ExchangeRates())->addCurrencyRate((object)[
                'amount' => $currency->amount,
                "rate" => $currency->rate,
                'currency_id' => $currency->id,
                'default_currency_id' => $defaultCurrency,
            ])->save();
        }

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
