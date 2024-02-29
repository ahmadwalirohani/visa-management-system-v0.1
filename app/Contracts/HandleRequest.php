<?php

namespace App\Contracts;

use Illuminate\Http\Request;

interface HandleRequest
{

    public function handle_action_requests(Request $request);

    public function handle_resource_requests(string $payload);
}
