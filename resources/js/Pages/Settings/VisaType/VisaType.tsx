import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddVisaType from "./Partials/AddVisaType";
import ViewVisaType from "./Partials/ViewVisaType";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ValidateNativeForm } from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";

interface IVisaTypeFields {
    name: string;
    code: string;
    id: number;
    status: number;
}

export default function VisaType() {
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        code: {
            state: false,
            msg: "",
        },
    });

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    // Function to load visa_types asynchronously from the server
    const LoadVisaTypes = async () => {
        setFetchLoading(true);

        // Making a GET request to retrieve branch data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_visa_types",
                }),
            )
            .then((Response: AxiosResponse) => {
                // Setting the retrieved data to the 'rows' state
                setRows(Response.data);
            })
            .finally(() => setFetchLoading(false));
    };

    // State to manage form actions base states
    const [useFormFunctionalInfo, setFormFunctionalInfo] = useState({
        loading: false,
        is_update: false,
        type_id: 0,
    });

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, ["name", "code"])
            .then((validated) => {
                // Updating form validation state with validation results
                setFormValidation((prevState) => ({
                    ...prevState,
                    ...validated.validated_payload,
                }));

                // Setting loading state to true during form submission
                setFormFunctionalInfo((prevState) => ({
                    ...prevState,
                    loading: true,
                }));

                // Creating a configuration for sending an action request
                const Config = SendActionRequest(
                    {
                        _class: "SettingsLogics",
                        _method_name: "add_visa_type",
                        _validation_class: "VisaType",
                    },
                    Object.assign({}, validated.payload, useFormFunctionalInfo),
                );

                // Making a POST request to submit the form data
                axios
                    .post(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "ویزي ډول په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        LoadVisaTypes(); // Reloading visa_types after successful submission
                    })
                    .catch((Error): any => {
                        // Handling error by updating the Snackbar state with the error message
                        setSnackbar({
                            msg: Error.response.data.message,
                            state: "danger",
                            is_open: true,
                        });
                    })
                    .finally(() =>
                        setFormFunctionalInfo((prevState) => ({
                            ...prevState,
                            loading: false,
                        })),
                    ); // Setting loading state to false after form submission
            })
            .catch((errors) => {
                // Handling form validation errors by updating the form validation state
                setFormValidation((prevState) => ({
                    ...prevState,
                    ...errors,
                }));
            });
    };

    // State to manage the fetched rows of data
    const [rows, setRows] = useState<Array<object>>([]);

    // State to manage loading state during visa_type data fetching
    const [fetchLoading, setFetchLoading] = useState(true);

    // useEffect hook to load visa_types when the component mounts
    useEffect(() => {
        LoadVisaTypes();
    }, []);

    const editVisaType = (visa_type: IVisaTypeFields): void => {
        (
            formRef.current?.elements.namedItem("name") as HTMLInputElement
        ).value = visa_type.name;

        (
            formRef.current?.elements.namedItem("code") as HTMLInputElement
        ).value = visa_type.code;

        setFormFunctionalInfo({
            is_update: true,
            loading: false,
            type_id: visa_type.id,
        });
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            type_id: 0,
        });
    };

    const changeVTypeStatus = (
        visa_type: IVisaTypeFields,
        model: string,
    ): void => {
        setFetchLoading(true);

        axios
            .post("change_resource_status", {
                id: visa_type.id,
                model,
                status: visa_type.status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `ویزي ډول په بریالي سره ${visa_type.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadVisaTypes();
            })
            .finally(() => setFetchLoading(false));
    };

    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                <AddVisaType
                    useSnackbar={useSnackbar}
                    closeSnackbar={() =>
                        setSnackbar((prevState) => ({
                            ...prevState,
                            is_open: false,
                        }))
                    }
                    resetForm={resetForm}
                    formRef={formRef}
                    formInfo={useFormFunctionalInfo}
                    onSubmit={onSubmit}
                    formValidation={useFormValidation}
                />
            </Grid>
            <Grid xs={8} md={8} sm={12}>
                <Sheet sx={{ height: "65vh", overflow: "auto" }}>
                    <ViewVisaType
                        editVisaType={editVisaType}
                        fetchLoading={fetchLoading}
                        visa_types={rows}
                        changeStatus={changeVTypeStatus}
                        loadVisaTypes={LoadVisaTypes}
                    />
                </Sheet>
            </Grid>
        </Grid>
    );
}
