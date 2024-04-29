<?php

namespace App\DomainsLogic;

use App\Actions\VisaActions;
use App\Http\Requests\CreateVisaRequest;
use App\Models\SystemInfo;
use App\Models\Visa;
use App\Models\VisaExpense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisaLogics
{


    public static function create_new_visa(CreateVisaRequest $request): JsonResponse
    {
        DB::beginTransaction();

        try {
            (new VisaActions(new Visa()))
                ->createNewVisa(
                    (object)([
                        "visa_entrance_type" => $request->visa_entrance_type['id'],
                        "customer" => $request->customer['id'],
                        "branch" => $request->customer['branch_id'],
                    ] + $request->all())
                )
                ->creditAdvanceVisaPayment(
                    $request->till,
                    $request->currency,
                    $request->advance_amount,
                    $request->customer['id'],
                    $request->premarks,
                )
                ->updateVisaNo();

            UsersLogics::create_user_record(
                'ADD-NEW-VISA',
                $request->branch,
                'د نوي ویزي ثبت',
                '',
                (object)[
                    'visa_no' => SystemInfo::whereId(1)->first()->visa_no - 1,
                    'customer' => $request->customer['name'],
                    'passport_no' => $request->passport_no,
                    'basis_type' => $request->basis_type,
                    'name' => $request->name,
                    'visa_entrance_type' => $request->visa_entrance_type['name'],
                ],
            );
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function edit_visa(CreateVisaRequest $request): JsonResponse
    {
        (new VisaActions(new Visa()))
            ->editVisa(
                (object)([
                    "visa_entrance_type" => $request->visa_entrance_type['id'],
                    "customer" => $request->customer['id'],
                    "branch" => $request->customer['branch_id'],
                ] + $request->all())
            );
        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function book_visa_status(Request $request): JsonResponse
    {

        VisaActions::bookedVisaStatus($request->visa_id, $request->booked_date);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function order_visa_status(Request $request): JsonResponse
    {
        $request->validate([
            'visa_id' => 'required|numeric|min:1',
            'expenses' => 'required|array',
        ]);

        DB::beginTransaction();

        try {

            (new VisaActions(new Visa()))
                ->orderedVisaStatus($request->visa_id)
                ->addVisaExpenses((object) $request->expenses);
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function cancel_visa(Request $request): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string',
            'visa_id' => 'required|numeric|min:1',
        ]);

        VisaActions::cancelVisa($request->visa_id, $request->reason);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function delete_visa_expense(Request $request): JsonResponse
    {
        VisaExpense::destroy($request->id);

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function proceed_pending_visas(Request $request): JsonResponse
    {
        $request->validate([
            'visas' => 'required|array',
            'till_id' => 'required|numeric|min:1',
            'expenses' => 'required|array'
        ]);

        DB::beginTransaction();

        try {

            (new VisaActions(new Visa()))
                ->createProcessedVisas($request->visas)
                ->deductExpensesFromTill(
                    $request->till_id,
                    $request->expenses,
                    collect($request->visas)->pluck('visa_no')->join(', ', ' and ')
                );
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();

        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function add_visa_discount(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            (new VisaActions(new Visa()))
                ->addVisaDiscount($request->visa_id, $request->discount_amount)
                ->createVisaDiscountStatement($request->customer_id, $request->currency_id, $request->visa_id, $request->discount_amount, $request->remarks);
        } catch (\Exception $th) {

            DB::rollBack();
            throw $th;
        }

        DB::commit();
        return response()->json([true], JsonResponse::HTTP_OK);
    }

    public static function commit_visas(Request $request): JsonResponse
    {
        $request->validate([
            'visa_count' => 'required|numeric|min:1',
            'customer' => 'required',
            'image' => 'required|image',
            'selectedVisas' => 'required|array',
        ]);


        DB::beginTransaction();

        try {
            $imageName = null;
            if ($request->hasFile("image")) {
                $uploadedImage = $request->file('image');
                $imageName =  uniqid('image_') . '.' . $uploadedImage->getClientOriginalExtension();
                $request->file("image")->move("agents_images", $imageName);
            }

            (new VisaActions(new Visa()))
                ->commitVisaToCustomer(
                    $request->customer,
                    $request->name,
                    $request->selectedVisas,
                    0,
                    '/agents_images/' . $imageName,
                    $request->remarks
                );
        } catch (\Exception $th) {

            DB::rollBack();

            throw $th;
        }

        DB::commit();

        return response()->json([true], 200);
    }
}
