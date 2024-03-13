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
            [
                'SettingsLogics' => \App\DomainsLogic\SettingsLogics::class,
                'UsersLogics' => \App\DomainsLogic\UsersLogics::class,
                'HRLogics' => \App\DomainsLogic\HRLogics::class,
            ],
            [
                'branch' => \App\Http\Requests\CreateBranchRequest::class,
                'CreateUser' => \App\Http\Requests\CreateUserRequest::class,
                'currency' => \App\Http\Requests\CreateCurrencyRequest::class,
                'eicode' => \App\Http\Requests\CreateEICodeRequest::class,
                'VisaType' => \App\Http\Requests\CreateVisaTypeRequest::class,
                'VisaTypeEntrance' => \App\Http\Requests\CreateVisaTypeEntranceRequest::class,
                'CreateCustomer' => \App\Http\Requests\CreateCustomerRequest::class,
            ],
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

        return (new ResourceRequestWrapper([
            'SettingsResources' => \App\Resources\SettingResources::class,
            'HRResources' => \App\Resources\HRResources::class,
        ], $decodedPayload))
            ->handle();
    }
}
