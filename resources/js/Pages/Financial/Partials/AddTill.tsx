import Input from "@mui/joy/Input";
import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import React, { useEffect } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { SendActionRequest } from "@/Utils/helpers";
import { ValidateCustomForm } from "@/Utils/Validation";
import InputField from "@/Components/InputField";
import { Grid, Option, Select, Sheet, Table } from "@mui/joy";
import {
    GetTillLatestID,
    LoadBranches,
    LoadCurrencies,
} from "@/Utils/FetchResources";
import { useEventEmitter } from "../Tills";

interface ICustomerFormFields {
    name: string;
    branch: number | null;
    code: string | null;
    balancies: Array<object>;
}

function AddTill() {
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

    const [useFormFields, setFormFields] = useState<ICustomerFormFields>({
        name: "",
        code: "",
        branch: 0,
        balancies: [],
    });

    const [useBranches, setBranches] = useState<Array<object>>();
    const { addEventListener, emitEvent } = useEventEmitter();

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    // State to manage form actions base states
    const [useFormFunctionalInfo, setFormFunctionalInfo] = useState({
        loading: false,
        is_update: false,
        till_id: 0,
    });

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleOnInputChange = (e: ChangeEvent, field: string): void => {
        setFormFields((prevState) => ({
            ...prevState,
            [field]: (e.target as HTMLInputElement).value,
        }));
    };

    const handleBranchChange = (
        event: React.SyntheticEvent | null,
        newValue: number | null,
    ) => {
        setFormFields((prevState) => ({
            ...prevState,
            branch: newValue,
        }));
    };

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateCustomForm(useFormFields, ["name", "code"])
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
                        _class: "FinancialLogics",
                        _method_name: "add_till",
                        _validation_class: "CreateTill",
                    },
                    Object.assign(
                        {},
                        { ...useFormFields },
                        validated.payload,
                        useFormFunctionalInfo,
                    ),
                );

                // Making a POST request to submit the form data
                axios
                    .post(Config.url, Config.payload)
                    .then((Response: AxiosResponse<any>): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "دخل په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        setFormFields((prevState) => ({
                            ...prevState,
                            code: `T-${Response.data.original}`,
                        }));

                        emitEvent("ReloadTillsEvent", true);

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

    const resetForm = (): void => {
        const updatedBalancies = useFormFields.balancies.map((prevBalance) => ({
            ...prevBalance,
            balance: 0,
        }));

        setFormFields((prevState) => ({
            name: "",
            code: prevState.code,
            branch: 0,
            balancies: updatedBalancies,
        }));

        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            till_id: 0,
        });
    };

    // Callback function to handle the emitted event
    const handleReceivePayloadEvent = (eventData?: any) => {
        setFormFields((prevState) => ({
            ...prevState,
            name: eventData.name,
            code: eventData.code,
            branch: eventData.branch_id,
        }));

        setFormFunctionalInfo({
            loading: false,
            is_update: true,
            till_id: eventData.id,
        });
    };

    useEffect(() => {
        LoadCurrencies((currencies: Array<object>): void => {
            setFormFields(function (prevState) {
                const Currencies = currencies.map((currency: any) => {
                    return {
                        id: currency.id,
                        name: currency.name,
                        balance: 0,
                    };
                });
                return {
                    ...prevState,
                    balancies: Currencies,
                };
            });
        });

        GetTillLatestID(function (id: number | null | string | boolean): void {
            setFormFields((prevState) => ({
                ...prevState,
                code: `T-${id}`,
            }));
        });

        LoadBranches((branches: Array<object>): void => {
            setBranches(branches);
        });
        addEventListener("SendPayloadToFormEvent", handleReceivePayloadEvent);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener(
                "SendPayloadToFormEvent",
                handleReceivePayloadEvent,
            );
        };
    }, []);

    return (
        <Grid xl={3} md={3} sm={12}>
            <form
                onSubmit={(event: React.FormEvent<HTMLFormElement>) =>
                    onSubmit(event)
                }
                ref={formRef}
                method="post"
                style={{
                    marginTop: 30,
                }}
            >
                <InputField
                    placeHolder="دخل نوم *"
                    name="name"
                    type="text"
                    value={useFormFields.name as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.name}
                />

                <InputField
                    placeHolder="دخل کود *"
                    name="code"
                    type="text"
                    readonly={true}
                    value={useFormFields.code as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.code}
                />

                <Select
                    sx={{ mt: 2 }}
                    onChange={handleBranchChange}
                    value={useFormFields.branch}
                    placeholder="څانګه انتخاب"
                >
                    {useBranches?.map((branch: any, index: number) => (
                        <Option key={index} value={branch.id}>
                            {" "}
                            {branch.name}{" "}
                        </Option>
                    ))}
                </Select>

                <Sheet
                    sx={{
                        maxHeight: "30vh",
                        overflow: "auto",
                        marginTop: 2,
                    }}
                >
                    <Table
                        stickyHeader
                        sx={{
                            tableLayout: "auto",
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ textAlign: "right" }}>#</th>
                                <th style={{ textAlign: "right" }}>اسعار</th>
                                <th style={{ textAlign: "right" }}>مبلغ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {useFormFields.balancies.map(
                                (currency: any, index: number) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{currency.name}</td>
                                        <td>
                                            {" "}
                                            <Input
                                                placeholder="مبلغ"
                                                size="sm"
                                                type="number"
                                                className="balanceInputs"
                                                value={currency.balance}
                                                disabled={
                                                    useFormFunctionalInfo.is_update
                                                }
                                                onChange={(e) => {
                                                    const updatedBalance =
                                                        useFormFields.balancies.map(
                                                            (
                                                                prevBalance,
                                                                i,
                                                            ) => {
                                                                if (
                                                                    i == index
                                                                ) {
                                                                    return {
                                                                        id: currency.id,
                                                                        name: currency.name,
                                                                        balance:
                                                                            (
                                                                                e.target as HTMLInputElement
                                                                            )
                                                                                .value,
                                                                    };
                                                                }

                                                                return prevBalance;
                                                            },
                                                        );
                                                    setFormFields(
                                                        (prevState) => ({
                                                            ...prevState,
                                                            balancies:
                                                                updatedBalance,
                                                        }),
                                                    );
                                                }}
                                            />{" "}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </Table>
                </Sheet>
                <Button
                    type="submit"
                    variant={
                        useFormFunctionalInfo.is_update ? "outlined" : "solid"
                    }
                    style={{ marginTop: 20 }}
                    loading={useFormFunctionalInfo.loading}
                >
                    {useFormFunctionalInfo.is_update ? "تغیر" : "ثبت"}
                </Button>
                <Button
                    type="reset"
                    variant="soft"
                    onClick={() => resetForm()}
                    style={{ marginTop: 20, marginRight: 30 }}
                >
                    {" "}
                    پاکول{" "}
                </Button>
            </form>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={3000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() =>
                    setSnackbar({
                        is_open: false,
                        state: "string",
                        msg: "",
                    })
                }
            >
                {useSnackbar.msg}
            </Snackbar>
        </Grid>
    );
}

export default AddTill;
