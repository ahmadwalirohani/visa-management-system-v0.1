import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddCurrency from "./Partials/AddCurrency";
import ViewCurrency from "./Partials/ViewCurrency";
import { FormEvent, useEffect, useRef, useState } from "react";
import ValidateNativeForm from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";

interface ICurrencyFields {
    name: string;
    symbol: string;
    id: number;
    status: number;
}

export default function Currency() {
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        symbol: {
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

    // Function to load currencies asynchronously from the server
    const LoadCurrencies = async () => {
        setFetchLoading(true);

        // Making a GET request to retrieve currency data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_currencies",
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
        currency_id: 0,
    });

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, ["name", "symbol"])
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
                        _method_name: "add_currency",
                        _validation_class: "currency",
                    },
                    Object.assign({}, validated.payload, useFormFunctionalInfo),
                );

                // Making a POST request to submit the form data
                axios
                    .post(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "اسعار په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        LoadCurrencies(); // Reloading currencies after successful submission
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

    // State to manage loading state during currncy data fetching
    const [fetchLoading, setFetchLoading] = useState(true);

    // useEffect hook to load currencies when the component mounts
    useEffect(() => {
        LoadCurrencies();
    }, []);

    const editCurrency = (currency: ICurrencyFields): void => {
        (
            formRef.current?.elements.namedItem("name") as HTMLInputElement
        ).value = currency.name;

        (
            formRef.current?.elements.namedItem("symbol") as HTMLInputElement
        ).value = currency.symbol;

        setFormFunctionalInfo({
            is_update: true,
            loading: false,
            currency_id: currency.id,
        });
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            currency_id: 0,
        });
    };

    const changeCurrencyStatus = (currency: ICurrencyFields): void => {
        setFetchLoading(true);

        axios
            .post("change_resource_status", {
                id: currency.id,
                model: "Currency",
                status: currency.status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `اسعار په بریالي سره ${currency.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadCurrencies();
            })
            .finally(() => setFetchLoading(false));
    };

    const changeCurrencyToDefault = (currency_id: number): void => {
        setFetchLoading(true);

        const Config = SendActionRequest(
            {
                _class: "SettingsLogics",
                _method_name: "set_currency_to_default",
                _validation_class: null,
            },
            {
                currency_id,
            },
        );

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: `اسعار په بریالي سره د عمومي په حیث سول`,
                    state: "success",
                    is_open: true,
                });
                LoadCurrencies();
            })
            .finally(() => setFetchLoading(false));
    };

    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                <AddCurrency
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
                    <ViewCurrency
                        editCurrency={editCurrency}
                        fetchLoading={fetchLoading}
                        currencies={rows}
                        changeStatus={changeCurrencyStatus}
                        changeToDefault={changeCurrencyToDefault}
                    />
                </Sheet>
            </Grid>
        </Grid>
    );
}
