/**
 * Validates form data based on a list of input names.
 * @param formData - The HTMLFormElement representing the form data to be validated.
 * @param inputNames - An array of string input names to be validated.
 * @returns A Promise that resolves with an object containing the validation result.
 * @throws If validation fails, the Promise is rejected with an object containing error information.
 */

interface IResolveObject {
    payload: object;
    validated_payload: object;
}

export function ValidateNativeForm(
    formData: HTMLFormElement,
    inputNames: Array<string>,
): Promise<IResolveObject> {
    return new Promise((resolve, reject) => {
        // Interface defining an object with boolean state and a message for each input name
        interface IValidateResultObject {
            [key: string]: {
                state: boolean;
                msg: string;
            };
        }

        // Interface defining an object with any type for each input name
        interface IResult {
            [key: string]: any;
        }

        // Initialize an object to store validation results
        const vResultObj: IValidateResultObject = {};

        // Initialize an object to store the final result
        const resultObj: IResult = {};

        // Iterate through each input name for validation
        inputNames.forEach((name: string) => {
            // Extract the input element based on the input name
            const isElement =
                (formData.elements.namedItem(name) as HTMLInputElement)
                    ?.value || false;

            // Check the validity of the input element
            if (
                isElement &&
                isElement !== "" &&
                isElement !== null &&
                isElement !== undefined
            ) {
                // If the input is valid, store it in the result object
                resultObj[name] = isElement;

                // Initialize validation result for the input name
                vResultObj[name] = {
                    state: false,
                    msg: "دا برخه حتمي ده",
                };
            } else {
                // If the input is invalid, update the validation result accordingly
                vResultObj[name] = {
                    state: true,
                    msg: "دا برخه حتمي ده",
                };
            }
        });

        // Check if there are any validation errors
        if (Object.values(vResultObj).some((o) => o.state === true)) {
            // If validation fails, reject the Promise with the validation result object
            reject(vResultObj);
        } else {
            // If validation passes, resolve the Promise with the final result object
            resolve({
                payload: resultObj,
                validated_payload: vResultObj,
            });
        }
    });
}

// Example usage:
// validateForm(myFormElement, ['username', 'email'])
//   .then((result) => {
//     console.log('Form validation successful:', result);
//   })
//   .catch((error) => {
//     console.error('Form validation failed:', error);
//   });

export function ValidateCustomForm(): void {}
