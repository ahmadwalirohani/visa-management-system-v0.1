<?php

use App\Http\Controllers\ModelActivisionController;
use App\Http\Controllers\RequestGatewayController;
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

    Route::get('/human_resource', function () {
        return Inertia::render('HumanResource/Customer');
    })->name('human_resource.customer');
});

require __DIR__ . '/auth.php';
