import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddSystemInfo from "./Partials/AddSystemInfo";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ValidateNativeForm } from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";

interface ISystemInfoEntity {
    company_ceo: string;
    company_name: string;
    company_address: string;
    company_email: string;
    company_phone1: string | null;
    company_phone2: string | null;
    company_logo: string;
    voucher_no: number;
    payment_no: number;
    visa_no: number;
    loading: boolean;
}

export default function SystemInfo() {
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        company_ceo: {
            state: false,
            msg: "",
        },
        company_name: {
            state: false,
            msg: "",
        },
        company_email: {
            state: false,
            msg: "",
        },
        company_address: {
            state: false,
            msg: "",
        },
    });

    const [useSystemInfo, setSystemInfo] = useState<ISystemInfoEntity>({
        company_ceo: "",
        company_address: "",
        company_email: "",
        company_logo: "",
        company_name: "",
        company_phone1: "",
        company_phone2: "",
        voucher_no: 0,
        payment_no: 0,
        visa_no: 0,
        loading: false,
    });

    useEffect(() => {
        Load();
    }, []);

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    // Function to load users asynchronously from the server
    const Load = async () => {
        // Making a GET request to retrieve User data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_system_infos",
                }),
            )
            .then((Response: AxiosResponse) => {
                // Setting the retrieved data to the 'rows' state
                setSystemInfo({
                    ...Response.data,
                });
            });
    };

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileInput = new FormData(e.currentTarget).get("image") as File;

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, [
            "company_ceo",
            "company_name",
            "company_email",
            "company_address",
        ])
            .then((validated) => {
                // Updating form validation state with validation results
                setFormValidation((prevState) => ({
                    ...prevState,
                    ...validated.validated_payload,
                }));

                // Setting loading state to true during form submission
                setSystemInfo((prevState) => ({
                    ...prevState,
                    loading: true,
                }));

                // Creating a configuration for sending an action request
                const Config = SendActionRequest(
                    {
                        _class: "SettingsLogics",
                        _method_name: "update_system_info",
                        _validation_class: null,
                    },
                    Object.assign(
                        {},
                        validated.payload,
                        {
                            company_logo: fileInput,
                        },
                        useSystemInfo,
                    ),
                );

                // Making a POST request to submit the form data
                axios
                    .postForm(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "سیسټم معلومات په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
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
                        setSystemInfo((prevState) => ({
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

    const resetForm = (): void => {
        formRef.current?.reset();
    };

    const handleOnInputChange = (e: ChangeEvent, field: string): void => {
        setSystemInfo((prevState) => ({
            ...prevState,
            [field]: (e.target as HTMLInputElement).value,
        }));
    };
    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                <AddSystemInfo
                    useSnackbar={useSnackbar}
                    closeSnackbar={() =>
                        setSnackbar((prevState) => ({
                            ...prevState,
                            is_open: false,
                        }))
                    }
                    resetForm={resetForm}
                    formRef={formRef}
                    formInfo={useSystemInfo}
                    onSubmit={onSubmit}
                    formValidation={useFormValidation}
                    preImage={useSystemInfo.company_logo}
                    handleOnInputChange={handleOnInputChange}
                />
            </Grid>
            <Grid xs={8} md={8} sm={12}>
                <Sheet sx={{ height: "65vh", overflow: "auto" }}></Sheet>
            </Grid>
        </Grid>
    );
}
