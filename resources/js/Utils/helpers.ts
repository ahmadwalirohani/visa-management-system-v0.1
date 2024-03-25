// Definition for the common resource configuration
interface IResourceConfig {
    _class: string; // Class identifier for the resource
    _method_name: string; // Method name for the resource
}

// Extension of IResourceConfig with additional action-related properties
interface IActionConfig extends IResourceConfig {
    _validation_class: string | null; // Validation class identifier for actions
}

// Function to generate a URL for sending resource requests
function SendResourceRequest(config: IResourceConfig, parameters: object = {}) {
    return `/Z2VuZXJhbA/cmVzb3VyY2Vz/${btoa(
        encodeURIComponent(
            JSON.stringify(
                Object.assign(
                    {},
                    {
                        X2NsYXNz: btoa(config._class), // Encode the class
                        X21ldGhvZF9uYW1l: btoa(config._method_name), // Encode the method name
                    },
                    parameters, // Include additional parameters
                ),
            ),
        ),
    )}`;
}

// Function to generate a payload for sending action requests
function SendActionRequest(config: IActionConfig, parameters = {}) {
    return {
        url: "/Z2VuZXJhbA/YWN0aW9ucw", // Action request URL
        payload: Object.assign(
            {},
            {
                X2NsYXNz: btoa(config._class), // Encode the class
                X21ldGhvZF9uYW1l: btoa(config._method_name), // Encode the method name
            },
            config._validation_class
                ? {
                      X3ZhbGlkYXRpb25fY2xhc3M: btoa(config._validation_class), // Encode validation class if provided
                  }
                : {},
            parameters, // Include additional parameters
        ),
    };
}

//function exchangeToDefault();

// Exporting the functions for use in other parts of the application
export { SendActionRequest, SendResourceRequest };
