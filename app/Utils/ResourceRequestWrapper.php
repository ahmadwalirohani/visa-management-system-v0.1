<?php

namespace App\Utils;

/**
 * Class ResourceRequestWrapper
 *
 * This class acts as a wrapper for handling resource-related actions based on a payload.
 *
 * @package App\Utils
 */
class ResourceRequestWrapper
{
    /**
     * ResourceRequestWrapper constructor.
     *
     * @param array  $action_classes An array of action classes.
     * @param object $payload        The payload object containing necessary data for resource actions.
     */
    public function __construct(
        private array $action_classes,
        private object $payload
    ) {
    }

    /**
     * Handle the resource request by invoking the appropriate action based on the payload data.
     *
     * @return mixed The result of the action execution.
     */
    public function handle()
    {
        // Decode the base64-encoded parameters from the payload.
        $actionClassKey = base64_decode($this->payload->X2NsYXNz);
        $actionMethodKey = base64_decode($this->payload->X21ldGhvZF9uYW1l);

        // Instantiate the action class and invoke the corresponding method.
        return $this->action_classes[$actionClassKey]::$actionMethodKey($this->payload);
    }
}
