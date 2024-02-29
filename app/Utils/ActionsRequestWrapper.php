<?php

namespace App\Utils;

use Illuminate\Http\Request;

/**
 * Class ActionsRequestWrapper
 *
 * This class acts as a wrapper for handling actions based on requests and validation classes.
 *
 * @package App\Utils
 */
class ActionsRequestWrapper
{
    /**
     * ActionsRequestWrapper constructor.
     *
     * @param array   $action_classes    An array of action classes.
     * @param array   $validation_classes An array of validation classes.
     * @param Request $request           The request object.
     */
    public function __construct(
        private array $action_classes,
        private array $validation_classes,
        Request $request
    ) {
    }

    /**
     * Handle the request by invoking the appropriate action based on the provided request data.
     *
     * @param Request $request The incoming HTTP request.
     *
     * @return mixed The result of the action execution.
     *
     * @throws AuthorizationException If the user is not authorized to perform the action.
     * @throws HttpClientException    If an HTTP client error occurs during validation.
     */
    public function handle($request)
    {
        // Decode the base64-encoded parameters from the request.
        $actionClassKey = base64_decode($request->X2NsYXNz);
        $actionMethodKey = base64_decode($request->X21ldGhvZF9uYW1l);
        $validationClassKey = base64_decode($request->X3ZhbGlkYXRpb25fY2xhc3M);

        // Instantiate the action class and invoke the corresponding method.
        return $this->action_classes[$actionClassKey]::$actionMethodKey(
            isset($this->validation_classes[$validationClassKey])
                ? app($this->validation_classes[$validationClassKey])
                : $request
        );
    }
}
