<?php

namespace App\Http\Controllers;

use App\Contracts\HandleRequest;
use Illuminate\Http\Request;
use App\Utils\ActionsRequestWrapper;
use App\Utils\ResourceRequestWrapper;

/**
 * Class RequestGatewayController
 *
 * This controller handles requests by using request wrappers for actions and resources.
 *
 * @package App\Http\Controllers
 */
class RequestGatewayController extends Controller implements HandleRequest
{
    /**
     * Handle action requests using the ActionsRequestWrapper.
     *
     * @param Request $request The incoming HTTP request.
     *
     * @return mixed The result of the action execution.
     */
    public function handle_action_requests(Request $request)
    {
        return (new ActionsRequestWrapper(
            [],
            [],
            $request
        ))
            ->handle($request);
    }

    /**
     * Handle resource requests using the ResourceRequestWrapper.
     *
     * @param string $payload The base64-encoded and URL-decoded payload containing data for resource actions.
     *
     * @return mixed The result of the resource action execution.
     */
    public function handle_resource_requests(string $payload)
    {
        // Decode the base64-encoded and URL-decoded payload.
        $decodedPayload = (object) json_decode(urldecode(base64_decode($payload)));

        return (new ResourceRequestWrapper([], $decodedPayload))
            ->handle();
    }
}
