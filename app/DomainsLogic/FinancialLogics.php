<?php

namespace App\DomainsLogic;

use App\Actions\BankActions;
use App\Actions\JournalEntryActions;
use App\Actions\TillActions;
use App\Http\Requests\CreateBankRequest;
use App\Http\Requests\CreateJournalEntryRequest;
use App\Http\Requests\CreateTillRequest;
use App\Models\Bank;
use App\Models\BankAccount;
use App\Models\Till;
use App\Models\TillAccount;
use App\Models\TillOCBalancies;
use App\Models\TillOpeningClosing;
use App\Resources\FinancialResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinancialLogics
{
    public static function add_till(CreateTillRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $till = $request->is_update ? Till::find($request->till_id) : new Till();
            $till->setData((object) $request->all())->save();

            if (!$request->is_update) {
                foreach ($request->balancies as $currency) {
                    $currency = (object) $currency;

                    (new TillActions($till->id))->createAccount(
                        new TillAccount(),
                        $currency->balance,
                        $currency->id,
                    )
                        ->createOpeningStatement(
                            'TILL-OPENING-BALANCE',
                            (float) $currency->balance,
                        );
                }
            }
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json(FinancialResources::get_till_latest_id(), JsonResponse::HTTP_OK);
    }

    public static function add_bank(CreateBankRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $bank = $request->is_update ? Bank::find($request->bank_id) : new Bank();
            $bank->setData((object) $request->all())->save();

            if (!$request->is_update) {
                foreach ($request->balancies as $currency) {
                    $currency = (object) $currency;

                    (new BankActions($bank->id))->createAccount(
                        new BankAccount(),
                        $currency->balance,
                        $currency->id,
                    )
                        ->createOpeningStatement(
                            'BANK-OPENING-BALANCE',
                            (float) $currency->balance,
                        );
                }
            }
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json(FinancialResources::get_bank_latest_id(), JsonResponse::HTTP_OK);
    }

    public static function add_journal_entry(CreateJournalEntryRequest $request): JsonResponse
    {

        DB::beginTransaction();

        try {
            (new JournalEntryActions(
                $request->creditType,
                $request->debitType,
                (object) $request->all()
            ))
                ->serializeTransactions();
        } catch (\Exception $th) {
            DB::rollBack();
            throw $th;
        }

        DB::commit();
        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function open_till_balancies(Request $request): JsonResponse
    {

        DB::beginTransaction();

        try {
            $tillOC = new TillOpeningClosing();
            $tillOC->setData((object) $request->all())->save();

            Till::whereId($request->id)->update([
                'is_open' => !$request->is_open
            ]);

            foreach ($request->balancies as $balance) {
                (new TillOCBalancies())->setData((object)[
                    'id' => $tillOC->id,
                    'currency_id' => $balance['id'],
                    'is_open' => $request->is_open,
                    'old_balance' => $balance['old_balance'],
                    'current_balance' => $balance['current_balance'],
                    'credit_amount' => $balance['credit_amount'],
                    'debit_amount' => $balance['debit_amount'],
                ])->save();
            }
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true, JsonResponse::HTTP_OK]);
    }

    public static function close_till_balancies(Request $request): JsonResponse
    {

        DB::beginTransaction();

        try {
            $tillOC =  TillOpeningClosing::find($request->model_id);
            $tillOC->setData((object) $request->all())->save();

            Till::whereId($request->id)->update([
                'is_open' => !$request->is_open
            ]);

            foreach ($request->balancies as $balance) {
                (TillOCBalancies::find($balance['model_id']))->setData((object)[
                    'is_open' => 1,
                    'current_balance' => $balance['current_balance'],
                    'credit_amount' => $balance['credit_amount'],
                    'debit_amount' => $balance['debit_amount'],
                ])->save();
            }
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }
}
