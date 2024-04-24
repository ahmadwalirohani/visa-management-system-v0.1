<?php

use App\Models\SystemInfo;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Print Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get("/print/visa-label-format/{visa_no}/{is_urgent}", function ($visa_no, $is_urgent) {
    return view("printFormats.visa-label-format", [
        "visa_no" => $visa_no,
        'is_urgent' => $is_urgent
    ]);
});

Route::get('/print/visa-sticker-format/{is_urgent}/{date}', function ($is_urgent, $date) {
    return view('printFormats.visa-sticker-format', ['is_urgent' => $is_urgent, 'date' => $date]);
});

Route::get('/print/visa-processed-format', function () {
    return view('printFormats.visa-processed-format');
});

Route::get('/print/general-format', function () {
    return view('printFormats.general_format');
});

Route::get('/print/payment-format', function () {
    return view('printFormats.payment_format')->with('system_info', SystemInfo::find(1));
});

Route::get('/print/customer-ledger-format', function () {
    return view('printFormats.customer-ledger-format')->with('system_info', SystemInfo::find(1));
});
