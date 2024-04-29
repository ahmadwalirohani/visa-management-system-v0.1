import Snackbar from "@mui/joy/Snackbar";
import Button from "@mui/joy/Button";
import React, { useEffect } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import axios from "axios";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { SendActionRequest } from "@/Utils/helpers";
import { ValidateCustomForm } from "@/Utils/Validation";
import InputField from "@/Components/InputField";
import { Autocomplete, Checkbox, Grid, Sheet, Table } from "@mui/joy";
import {
    GetCustomersAsItems,
    getUncommittedVisas,
} from "@/Utils/FetchResources";
import { useEventEmitter } from "../VisaCommitReport";

interface ICustomerFormFields {
    name: string;
    customer: any | null;
    visa_count: number | null;
    remarks: string | null;
    image: any | null;
    imageI: string | null;
}
interface IVisa {
    visa_no: number;
    name: string;
    id: number;
    customer: {
        id: number;
        name: string;
    };
    type: {
        id: number;
        name: string;
    };
    created_at: string;
    passport_no: string;
    branch: {
        id: number;
        name: string;
    };
    isSelected: boolean;
}

function AddVisaCommitting() {
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        visa_count: {
            state: false,
            msg: "",
        },
    });

    const [useFormFields, setFormFields] = useState<ICustomerFormFields>({
        name: "",
        visa_count: 0,
        customer: null,
        remarks: "",
        image: null,
        imageI: null,
    });
    const [useCustomers, setCustomers] = useState<Array<any>>([]);
    const [useVisas, setVisas] = useState<Array<any>>([]);

    const { addEventListener, emitEvent } = useEventEmitter();

    const [selected, setSelected] = useState<readonly IVisa[]>([]);
    const isSelected = (visa: IVisa): boolean => {
        return (
            selected.findIndex((v: IVisa) => v.visa_no == visa.visa_no) !== -1
        );
    };

    const handleClick = (event: React.MouseEvent<unknown>, visa: IVisa) => {
        const selectedIndex = selected.findIndex((v: IVisa) => v.id == visa.id);
        let newSelected: readonly IVisa[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, visa);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };
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
            ...(field == "imageI"
                ? {
                      image: (e.target as HTMLInputElement).files,
                  }
                : {}),
        }));
    };

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateCustomForm(useFormFields, ["name", "visa_count"])
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
                        _class: "VisaLogics",
                        _method_name: "commit_visas",
                        _validation_class: null,
                    },
                    Object.assign(
                        {
                            selectedVisas: selected.map((v) => v.id),
                        },
                        {
                            ...useFormFields,
                            image: useFormFields.image[0],
                            customer: useFormFields.customer.id,
                        },
                    ),
                );

                // Making a POST request to submit the form data
                axios
                    .postForm(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "عملیه په بریا سره اجرا سول",
                            state: "success",
                            is_open: true,
                        });

                        emitEvent("ReloadReportEvent", true);

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
        setFormFields({
            name: "",
            visa_count: 0,
            image: null,
            imageI: null,
            remarks: null,
            customer: null,
        });

        getUncommittedVisas((visas: Array<any>): void => {
            setVisas(visas);
        });

        setSelected([]);
    };

    // Callback function to handle the emitted event
    const handleReceivePayloadEvent = (eventData?: any) => {
        setFormFields((prevState) => ({
            ...prevState,
            name: eventData.name,
            visa_count: eventData.visa_count,
            customer: eventData.customer_id,
        }));

        setFormFunctionalInfo({
            loading: false,
            is_update: true,
            till_id: eventData.id,
        });
    };

    useEffect(() => {
        GetCustomersAsItems((_customers: Array<object>): void => {
            setCustomers(_customers);
        });

        getUncommittedVisas((visas: Array<any>): void => {
            setVisas(visas);
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
                <Autocomplete
                    placeholder="شرکت"
                    size="sm"
                    options={useCustomers}
                    getOptionLabel={(option: any) => option.name}
                    getOptionKey={(option: any) => option.id}
                    value={useFormFields.customer}
                    onChange={(e: any, newValue: any) => {
                        setFormFields((prev) => ({
                            ...prev,
                            customer: newValue,
                        }));
                    }}
                />

                <InputField
                    placeHolder="نماینده نوم *"
                    name="name"
                    type="text"
                    value={useFormFields.name as string}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.name}
                />

                <InputField
                    placeHolder=" ویزو شمیر *"
                    name="visa_count"
                    type="number"
                    value={useFormFields.visa_count as any}
                    onValChange={handleOnInputChange}
                    validation={useFormValidation.visa_count}
                />

                <InputField
                    placeHolder="نماینده عکس"
                    name="imageI"
                    type="file"
                    value={useFormFields.imageI as string}
                    onValChange={handleOnInputChange}
                />

                <InputField
                    placeHolder="تفصیل"
                    name="remarks"
                    type="text"
                    value={useFormFields.remarks as string}
                    onValChange={handleOnInputChange}
                />

                <Sheet
                    sx={{
                        height: "40vh",
                        overflow: "auto",
                        marginTop: 2,
                    }}
                >
                    <Table
                        sx={{
                            tableLayout: "auto",
                            "--TableCell-selectedBackground": (theme) =>
                                theme.vars.palette.neutral.softBg,
                        }}
                    >
                        <tbody>
                            {useVisas
                                .filter(
                                    (v) =>
                                        v.customer_id ==
                                        useFormFields.customer?.id,
                                )
                                .map((v: any, i: number) => {
                                    const isItemSelected = isSelected(v);
                                    const labelId = `enhanced-table-checkbox-${i}`;
                                    return (
                                        <tr
                                            key={i}
                                            onClick={(event) =>
                                                handleClick(event, v)
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            // selected={isItemSelected}
                                            style={
                                                isItemSelected
                                                    ? ({
                                                          "--TableCell-dataBackground":
                                                              "var(--TableCell-selectedBackground)",
                                                          "--TableCell-headBackground":
                                                              "var(--TableCell-selectedBackground)",
                                                      } as React.CSSProperties)
                                                    : {}
                                            }
                                        >
                                            <td>{v.visa_no}</td>
                                            <td>{v.passport_no}</td>
                                            <td>{v.type.name}</td>
                                            <td>{v.entrance_type.name}</td>
                                            <td>
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    slotProps={{
                                                        input: {
                                                            "aria-labelledby":
                                                                labelId,
                                                        },
                                                    }}
                                                    sx={{
                                                        verticalAlign: "top",
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
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

export default AddVisaCommitting;
