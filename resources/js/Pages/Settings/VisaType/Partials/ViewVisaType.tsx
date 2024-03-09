import Table from "@mui/joy/Table";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Button from "@mui/joy/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Edit from "@mui/icons-material/Edit";
import Chip from "@mui/joy/Chip";
import LinearProgress from "@mui/joy/LinearProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IconButton, ModalDialogProps, Sheet, Typography } from "@mui/joy";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import AddVisaSubType from "./AddVisaSubType";
import axios from "axios";
import { SendActionRequest } from "@/Utils/helpers";
import { ValidateNativeForm } from "@/Utils/Validation";

const resolveStatus = (status: number | boolean) => {
    if (status)
        return (
            <Chip variant="outlined" color="success">
                فعاله
            </Chip>
        );
    else
        return (
            <Chip variant="outlined" color="danger">
                غیري فعاله
            </Chip>
        );
};

interface IViewProps {
    visa_types: Array<object>;
    fetchLoading: boolean;
    editVisaType(visa_type: object): void;
    changeStatus(visa_type: object, model: string): void;
    loadVisaTypes(): void;
}

function ViewVisaType({
    visa_types,
    fetchLoading,
    editVisaType,
    changeStatus,
    loadVisaTypes,
}: IViewProps) {
    function Row(props: { row: any; initialOpen?: boolean }) {
        const { row } = props;
        const [open, setOpen] = React.useState(props.initialOpen || false);

        const setSubTypeEdit = (type: any): void => {
            setLayout("center");
            setSelectedVisaType(type.visa_type_id as string);

            setFormFunctionalInfo({
                is_update: true,
                loading: false,
                type_id: type.id,
            });

            setFormFields({
                code: type.code,
                name: type.name,
            });
        };

        return (
            <React.Fragment>
                <tr>
                    <td>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
                            <IconButton
                                aria-label="expand row"
                                variant="plain"
                                color="neutral"
                                size="sm"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? (
                                    <KeyboardArrowUpIcon />
                                ) : (
                                    <KeyboardArrowDownIcon />
                                )}
                            </IconButton>
                            <div>{row.id}</div>
                        </div>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.code}</td>
                    <td style={{ width: 120 }}>
                        <div>{resolveStatus(row.status)}</div>
                    </td>
                    <td dir="ltr" style={{ width: 100 }}>
                        <ButtonGroup>
                            <Button
                                onClick={() => changeStatus(row, "VisaType")}
                                title="ویزي ډول حالت تغیرول"
                            >
                                {row.status == 1 && <VisibilityOff />}
                                {row.status == 0 && <Visibility />}
                            </Button>
                            <Button onClick={() => editVisaType(row)}>
                                <Edit />
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
                <tr>
                    <td style={{ height: 0, padding: 0 }} colSpan={6}>
                        {open && (
                            <Sheet
                                variant="soft"
                                sx={{
                                    p: 1,
                                    pl: 6,
                                    boxShadow:
                                        "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
                                }}
                            >
                                <Typography level="body-lg" component="div">
                                    ویزي نوعیت دخول
                                </Typography>
                                <Table
                                    borderAxis="bothBetween"
                                    size="sm"
                                    aria-label="purchases"
                                    sx={{
                                        "& > thead > tr > th": {
                                            textAlign: "right",
                                        },
                                        "--TableCell-paddingX": "0.5rem",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>نوم</th>
                                            <th>کود</th>
                                            <th>حالت</th>
                                            <th>عملیی</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {row.entrance_types?.map(
                                            (type: any, pi: number) => (
                                                <tr key={pi}>
                                                    <td scope="row">
                                                        {type.id}
                                                    </td>
                                                    <td>{type.name}</td>
                                                    <td>{type.code}</td>
                                                    <td>
                                                        {resolveStatus(
                                                            type.status,
                                                        )}
                                                    </td>
                                                    <td dir="ltr">
                                                        <ButtonGroup size="sm">
                                                            <Button
                                                                onClick={() =>
                                                                    changeStatus(
                                                                        type,
                                                                        "VisaSubType",
                                                                    )
                                                                }
                                                                title="ویزي ډول حالت تغیرول"
                                                            >
                                                                {type.status ==
                                                                    1 && (
                                                                    <VisibilityOff />
                                                                )}
                                                                {type.status ==
                                                                    0 && (
                                                                    <Visibility />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                onClick={() =>
                                                                    setSubTypeEdit(
                                                                        type,
                                                                    )
                                                                }
                                                            >
                                                                <Edit />
                                                            </Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </Table>
                            </Sheet>
                        )}
                    </td>
                </tr>
            </React.Fragment>
        );
    }

    const [layout, setLayout] = useState<
        ModalDialogProps["layout"] | undefined
    >(undefined);

    const openAddVSubTViewDialog = (state: any): void => {
        setFormFunctionalInfo({
            is_update: false,
            type_id: 0,
            loading: false,
        });

        setFormFields({
            code: "",
            name: "",
        });
        setLayout(state);
    };

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
    // State to manage form actions base states
    const [useFormFunctionalInfo, setFormFunctionalInfo] = useState({
        loading: false,
        is_update: false,
        type_id: 0,
    });
    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    const [formFields, setFormFields] = useState({
        code: "",
        name: "",
    });

    const handleOnInputChange = (e: ChangeEvent, field: string): void => {
        setFormFields((prevState) => ({
            ...prevState,
            [field]: (e.target as HTMLInputElement).value,
        }));

        console.log(formFields);
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            type_id: 0,
        });

        setFormFields({
            code: "",
            name: "",
        });

        setSelectedVisaType(null);
    };

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
                        _method_name: "add_visa_type_entrance",
                        _validation_class: "VisaTypeEntrance",
                    },
                    Object.assign(
                        {},
                        validated.payload,
                        {
                            visa_type_id: selectedVisaType,
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
                            msg: "ویزي نوعیت دخول ډول په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        loadVisaTypes(); // Reloading visa_types after successful submission
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

    const [selectedVisaType, setSelectedVisaType] = useState<string | null>("");

    const onVisaTypeChange = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ): void => {
        setSelectedVisaType(newValue);
    };
    return (
        <>
            <div style={{ height: 5 }}>
                {fetchLoading && <LinearProgress />}
            </div>

            <Button onClick={() => openAddVSubTViewDialog("center")}>
                نوعیت دخول اضافه
            </Button>

            <Table
                aria-label="visa types table"
                stickyHeader
                stickyFooter
                hoverRow
                sx={{
                    "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                        { textAlign: "right" },
                    '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                        {
                            borderBottom: 0,
                        },
                    tableLayout: "auto",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "right" }}>#</th>
                        <th style={{ textAlign: "right" }}>نوم</th>
                        <th style={{ textAlign: "right" }}>کود</th>
                        <th style={{ textAlign: "right" }}>حالت</th>
                        <th style={{ textAlign: "right" }}>عملیی</th>
                    </tr>
                </thead>
                <tbody>
                    {visa_types.map((row: any, index: number) => (
                        <Row
                            key={row.name}
                            row={row}
                            initialOpen={index === 0}
                        />
                    ))}
                </tbody>
            </Table>

            <AddVisaSubType
                setLayoutState={openAddVSubTViewDialog}
                layout={layout}
                useSnackbar={useSnackbar}
                closeSnackbar={() =>
                    setSnackbar((prevState) => ({
                        ...prevState,
                        is_open: false,
                    }))
                }
                formRef={formRef}
                formInfo={useFormFunctionalInfo}
                onSubmit={onSubmit}
                formValidation={useFormValidation}
                visa_types={visa_types}
                selectedVisaType={selectedVisaType}
                handleVisaTypeChange={onVisaTypeChange}
                handleOnInputChange={handleOnInputChange}
                formData={formFields}
            />
        </>
    );
}

export default ViewVisaType;
