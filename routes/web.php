<?php

use App\Http\Controllers\ModelActivisionController;
use App\Http\Controllers\RequestGatewayController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('auth')->group(function () {

    Route::get('/', function () {

        return Inertia::render('Dashboard');
    })->middleware(['verified'])->name('dashboard');

    /**
     * These routes route request of posts and gets to Gateway Controller
     * The controller wrap request to the specified class and inject its dependencies
     */
    Route::post('/Z2VuZXJhbA/YWN0aW9ucw', [RequestGatewayController::class, 'handle_action_requests']);
    Route::get('/Z2VuZXJhbA/cmVzb3VyY2Vz/{payload}', [RequestGatewayController::class, 'handle_resource_requests']);

    /**
     * This route activate or deactivate Model specified in payload
     */
    Route::post('/change_resource_status', [ModelActivisionController::class, 'Activission']);

    Route::get('/settings', function () {
        return Inertia::render('Settings/Settings');
    })->name('settings');

    Route::get('/human-resource/customer', function () {
        return Inertia::render('HumanResource/Customer');
    })->name('human_resource.customer');

    Route::get('/human-resource/employee', function () {
        return Inertia::render('HumanResource/Employee');
    })->name('human_resource.employee');

    Route::get('/add-visa', function () {
        return Inertia::render('Visa/AddVisa');
    })->name('visa.add');

    Route::get('/pending-visa', function () {
        return Inertia::render('Visa/PendingVisa');
    })->name('visa.pending');

    Route::get('/journal-entry', function () {
        return Inertia::render('Financial/JournalEntry');
    })->name('financial.journal_entry');

    Route::get('/tills', function () {
        return Inertia::render('Financial/Tills');
    })->name('financial.tills');

    Route::get('/banks', function () {
        return Inertia::render('Financial/Bank');
    })->name('financial.banks');

    Route::get('/process-visa', function () {
        return Inertia::render('Visa/ProcessVisa');
    })->name('visa.process');

    Route::get('/human-resource/customer-ledger', function () {
        return Inertia::render('Reports/CustomerLedger');
    })->name('human_resource.customer_ledger');

    Route::get('/human-resource/employee-ledger', function () {
        return Inertia::render('Reports/EmployeeLedger');
    })->name('human_resource.employee_ledger');

    Route::get('/reports/bank-ledger', function () {
        return Inertia::render('Reports/BankLedger');
    })->name('reports.bank_ledger');

    Route::get('/reports/proceed-visa-report', function () {
        return Inertia::render('Reports/ProceedVisaReport');
    })->name('reports.proceed_visa_report');

    Route::get('/reports/ei-codes-report', function () {
        return Inertia::render('Reports/EICodesReport');
    })->name('reports.ei_codes_report');

    Route::get('/reports/loans-report', function () {
        return Inertia::render('Reports/LoansReport');
    })->name('reports.loans_report');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/print.php';
