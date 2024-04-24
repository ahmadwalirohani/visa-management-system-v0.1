import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddEICode from "./Partials/AddEICode";
import ViewEICode from "./Partials/ViewEICode";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ValidateNativeForm } from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

interface IEICodeFields {
    name: string;
    type: string;
    code: string;
    id: number;
    status: number;
}

export default function EICode() {
    const { privileges } = useUserBranchesContext();
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        type: {
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

    // Function to load expense_income_codes asynchronously from the server
    const LoadEICodes = async () => {
        setFetchLoading(true);

        // Making a GET request to retrieve currency data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_expense_income_codes",
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
        eicode_id: 0,
    });

    const [selectedType, setSelectedType] = useState("EXPENSE");

    const changeCodeType = (type: any) => {
        setSelectedType(type);
    };

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, ["name", "code"])
            .then((validated): any => {
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
                        _method_name: "add_expense_income_code",
                        _validation_class: "eicode",
                    },
                    Object.assign(
                        {},
                        validated.payload,
                        {
                            type: selectedType,
                        },
                        useFormFunctionalInfo,
                    ),
                );

                // Making a POST request to submit the form data
                axios
                    .post(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "کود په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        LoadEICodes(); // Reloading expense_income_codes after successful submission
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

    // State to manage loading state during expense income code data fetching
    const [fetchLoading, setFetchLoading] = useState(true);

    // useEffect hook to load expense_income_codes when the component mounts
    useEffect(() => {
        LoadEICodes();
    }, []);

    const editEICode = (eicode: IEICodeFields): void => {
        (
            formRef.current?.elements.namedItem("name") as HTMLInputElement
        ).value = eicode.name;

        (
            formRef.current?.elements.namedItem("code") as HTMLInputElement
        ).value = eicode.code;

        setSelectedType(eicode.type);

        setFormFunctionalInfo({
            is_update: true,
            loading: false,
            eicode_id: eicode.id,
        });
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            eicode_id: 0,
        });
    };

    const changeEICodeStatus = (eicode: IEICodeFields): void => {
        setFetchLoading(true);

        axios
            .post("change_resource_status", {
                id: eicode.id,
                model: "ExpenseIncomeCode",
                status: eicode.status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `کود په بریالي سره ${eicode.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadEICodes();
            })
            .finally(() => setFetchLoading(false));
    };

    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                {privileges.settings.ei_codes.add && (
                    <AddEICode
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
                        selectedType={selectedType}
                        formValidation={useFormValidation}
                        changeCodeType={changeCodeType}
                    />
                )}
            </Grid>
            <Grid xs={8} md={8} sm={12}>
                <Sheet sx={{ height: "65vh", overflow: "auto" }}>
                    {privileges.settings.ei_codes.list && (
                        <ViewEICode
                            editEICode={editEICode}
                            fetchLoading={fetchLoading}
                            expense_income_codes={rows}
                            changeStatus={changeEICodeStatus}
                        />
                    )}
                </Sheet>
            </Grid>
        </Grid>
    );
}
