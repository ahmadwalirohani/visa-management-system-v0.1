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
    GetCustomerLatestID,
    LoadBranches,
    LoadCurrencies,
} from "@/Utils/FetchResources";
import { useEventEmitter } from "../Customer";

interface ICustomerFormFields {
    name: string;
    phone: string;
    email: string;
    branch: number | null;
    address: string | null;
    province: string | null;
    agent_name: string | null;
    code: string | null;
    balancies: Array<object>;
}

function AddCustomer() {
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        phone: {
            state: false,
            msg: "",
        },
        province: {
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
        phone: "",
        email: "",
        province: "",
        address: "",
        code: "",
        agent_name: "",
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
        customer_id: 0,
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
        ValidateCustomForm(useFormFields, ["name", "phone", "province", "code"])
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
                        _class: "HRLogics",
                        _method_name: "add_customer",
                        _validation_class: "CreateCustomer",
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
                            msg: "مشتري په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        setFormFields((prevState) => ({
                            ...prevState,
                            code: `C-${Response.data.original}`,
                        }));

                        emitEvent("ReloadCustomersEvent", true);

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
            phone: "",
            email: "",
            province: "",
            address: "",
            code: prevState.code,
            agent_name: "",
            branch: 0,
            balancies: updatedBalancies,
        }));

        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            customer_id: 0,
        });
    };

    // Callback function to handle the emitted event
    const handleReceivePayloadEvent = (eventData?: any) => {
        setFormFields((prevState) => ({
            ...prevState,
            name: eventData.name,
            phone: eventData.phone,
            email: eventData.email,
            province: eventData.province,
            address: eventData.address,
            code: eventData.code,
            agent_name: eventData.agent_name,
            branch: eventData.branch_id,
        }));

        setFormFunctionalInfo({
            loading: false,
            is_update: true,
            customer_id: eventData.id,
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

        GetCustomerLatestID(function (
            id: number | null | string | boolean,
        ): void {
            setFormFields((prevState) => ({
                ...prevState,
                code: `C-${id}`,
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
        <Grid xl={2} md={2} sm={12}>
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
                    placeHolder="مشتري نوم *"
                    name="name"
                    type="text"
                    value={useFormFields.name as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.name}
                />

                <InputField
                    placeHolder="شرکت مسؤل *"
                    name="agent_name"
                    type="text"
                    value={useFormFields.agent_name as string}
                    onValChange={handleOnInputChange}
                    validation={false}
                />
                <InputField
                    placeHolder="مشتري تلیفون نمبر *"
                    name="phone"
                    type="text"
                    value={useFormFields.phone as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.phone}
                />
                <InputField
                    placeHolder="مشتري ایمیل ادرس *"
                    name="email"
                    type="text"
                    value={useFormFields.email as string}
                    onValChange={handleOnInputChange}
                    validation={false}
                />
                <InputField
                    placeHolder="مشتري ولایت *"
                    name="province"
                    type="text"
                    value={useFormFields.province as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.province}
                />
                <InputField
                    placeHolder="مشتري ادرس *"
                    name="address"
                    type="text"
                    value={useFormFields.address as string}
                    onValChange={handleOnInputChange}
                    validation={false}
                />
                <InputField
                    placeHolder="مشتري کود *"
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

export default AddCustomer;
