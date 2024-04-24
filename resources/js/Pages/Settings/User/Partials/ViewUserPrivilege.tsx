import {
    Alert,
    CardContent,
    Checkbox,
    DialogContent,
    Modal,
    ModalClose,
    ModalDialog,
    ModalDialogProps,
    Sheet,
    Typography,
    Button,
    Snackbar,
    ColorPaletteProp,
} from "@mui/joy";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { Card } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
import { SendActionRequest } from "@/Utils/helpers";

interface IInfo {
    id: number;
    name: string;
    email: string;
    privileges: any;
    branch: any;
    layout: ModalDialogProps["layout"] | undefined;
}

interface IModalProps {
    setLayoutState(state: ModalDialogProps["layout"] | undefined): void;
    infoProps: IInfo;
}

function ViewUserPrivilege({ setLayoutState, infoProps }: IModalProps) {
    const [usePrivileges, setPrivileges] = useState<any>({
        visa: {
            actions: {
                add: false,
                edit: false,
                cancel: false,
                add_expense: false,
                proceed: false,
                commit: false,
            },
            reports: {
                pending: false,
                proceed: false,
                committed: false,
            },
        },
        customer: {
            actions: {
                add: false,
                edit: false,
                delete: false,
            },
            reports: {
                list: false,
                ledger: false,
            },
        },
        employee: {
            actions: {
                add: false,
                edit: false,
                delete: false,
            },
            reports: {
                list: false,
                ledger: false,
            },
        },
        bank: {
            actions: {
                add: false,
                edit: false,
                delete: false,
            },
            reports: {
                list: false,
                ledger: false,
            },
        },
        till: {
            actions: {
                add: false,
                edit: false,
                delete: false,
                opening_closing: false,
            },
            reports: {
                list: false,
                open_closed: false,
            },
        },
        settings: {
            users: {
                add: false,
                edit: false,
                branch_control: false,
                list: false,
            },
            branches: {
                add: false,
                list: false,
            },
            ei_codes: {
                add: false,
                list: false,
            },
            system_infos: {
                add: false,
            },
            visa_types: {
                add: false,
                list: false,
            },
            currencies: {
                add: false,
                add_exchange_rate: false,
                list: false,
            },
        },
        misc: {
            add_journal_entry: false,
            view_journal_entries: false,
            user_logs: false,
            balance_sheet: false,
            loans: false,
            other_branches_control: false,
        },
    });
    const [useForm, setForm] = useState({
        loading: false,
    });

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const onAuthorityChange = (
        newValue: boolean,
        levelOneProp: any,
        levelTwoProp: any,
        levelThreeProp: any,
        isMisc: boolean = false,
    ) => {
        // if property of checkbox change from misc then just change value on level Two object
        // otherwise change level two as object for level three
        setPrivileges((prev: any) => ({
            ...prev,
            [levelOneProp]: {
                ...prev[levelOneProp],
                [levelTwoProp]: !isMisc
                    ? {
                          ...prev[levelOneProp][levelTwoProp],
                          [levelThreeProp]: newValue,
                      }
                    : newValue,
            },
        }));
    };

    const onSubmit = () => {
        setForm((prev) => ({
            ...prev,
            loading: true,
        }));

        const Config = SendActionRequest(
            {
                _class: "UsersLogics",
                _method_name: "update_user_privileges",
                _validation_class: null,
            },
            {
                privileges: JSON.stringify(usePrivileges),
                id: infoProps.id,
            },
        );

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: "عملیه په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });
            })
            .catch((Error): any => {
                setSnackbar({
                    msg: Error.response.data.message,
                    state: "danger",
                    is_open: true,
                });
            })
            .finally(() =>
                setForm((prev) => ({
                    ...prev,
                    loading: false,
                })),
            );
    };

    useEffect(() => {
        if (
            (typeof infoProps.privileges == "object"
                ? infoProps.privileges
                : JSON.parse(infoProps.privileges)
            )?.visa
        ) {
            setPrivileges(
                typeof infoProps.privileges == "object"
                    ? infoProps.privileges
                    : JSON.parse(infoProps.privileges),
            );
        }
    }, [infoProps.privileges]);

    return (
        <>
            <Modal
                open={!!infoProps.layout}
                onClose={() => {
                    setLayoutState(undefined);
                }}
                dir="rtl"
            >
                <ModalDialog
                    maxWidth={600}
                    minWidth={600}
                    dir="rtl"
                    layout={infoProps.layout}
                    sx={{
                        top: "50%",
                        height: "80vh",
                    }}
                >
                    <p style={{ fontSize: "small" }}>
                        یوزر ته د څانګي اړوند صلاحیتونه ورکول
                    </p>
                    <ModalClose
                        sx={{
                            right: "inherit",
                            left: "var(--ModalClose-inset)",
                        }}
                    />

                    <DialogContent
                        sx={{
                            overflow: "hidden",
                        }}
                    >
                        <Alert
                            variant="outlined"
                            color="neutral"
                            sx={{
                                marginBottom: 2,
                            }}
                            startDecorator={<AccountCircleRoundedIcon />}
                        >
                            {infoProps?.name} &nbsp;&nbsp;&nbsp; | &nbsp;{" "}
                            {infoProps?.email} &nbsp;&nbsp;&nbsp; | &nbsp;{" "}
                            {infoProps?.branch}
                        </Alert>

                        <Sheet
                            sx={{
                                height: "100%",
                                overflowY: "auto",
                                overflowX: "hidden",
                                "&  > .MuiCard-colorNeutral": {
                                    marginTop: 2,
                                },
                            }}
                        >
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    ویزي برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.add
                                                    }
                                                    name="add-new-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    نوي ویزي اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.edit
                                                    }
                                                    name="edit-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي ایډیټ کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.cancel
                                                    }
                                                    name="cancel-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "cancel",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي کنسل کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.add_expense
                                                    }
                                                    name="add_expense-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "add_expense",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي مصارف رسول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.proceed
                                                    }
                                                    name="proceed-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "proceed",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي جاري کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .actions.commit
                                                    }
                                                    name="commit-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "actions",
                                                            "commit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي تسلیم کول
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .reports.pending
                                                    }
                                                    name="pending-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "reports",
                                                            "pending",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    معطلو ویزو راپور
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .reports.proceed
                                                    }
                                                    name="proceed-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "reports",
                                                            "proceed",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    جاري سوي ویزي راپور
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.visa
                                                            .reports.committed
                                                    }
                                                    name="committed-visa"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "visa",
                                                            "reports",
                                                            "committed",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    تسلیم سوي ویزو راپور
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    مشتري برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.customer
                                                            .actions.add
                                                    }
                                                    name="add-customer"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "customer",
                                                            "actions",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    مشتري اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.customer
                                                            .actions.edit
                                                    }
                                                    name="edit-customer"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "customer",
                                                            "actions",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    مشتري تغیر کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.customer
                                                            .actions.delete
                                                    }
                                                    name="delete-customer"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "customer",
                                                            "actions",
                                                            "delete",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    مشتري لري کول
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.customer
                                                            .reports.list
                                                    }
                                                    name="list-customer"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "customer",
                                                            "reports",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    مشتري لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.customer
                                                            .reports.ledger
                                                    }
                                                    name="ledger-customer"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "customer",
                                                            "reports",
                                                            "ledger",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    مشتري کهاته کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    کارمند برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.employee
                                                            .actions.add
                                                    }
                                                    name="add-employee"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "employee",
                                                            "actions",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کارمند اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.employee
                                                            .actions.edit
                                                    }
                                                    name="edit-employee"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "employee",
                                                            "actions",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کارمند تغیر کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.employee
                                                            .actions.delete
                                                    }
                                                    name="delete-employee"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "employee",
                                                            "actions",
                                                            "delete",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کارمند لري کول
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.employee
                                                            .reports.list
                                                    }
                                                    name="list-employee"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "employee",
                                                            "reports",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کارمند لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.employee
                                                            .reports.ledger
                                                    }
                                                    name="ledger-employee"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "employee",
                                                            "reports",
                                                            "ledger",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کارمند کهاته کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    صرافي برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.bank
                                                            .actions.add
                                                    }
                                                    name="add-bank"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "bank",
                                                            "actions",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    صرافي اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.bank
                                                            .actions.edit
                                                    }
                                                    name="edit-bank"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "bank",
                                                            "actions",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    صرافي تغیر کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.bank
                                                            .actions.delete
                                                    }
                                                    name="delete-bank"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "bank",
                                                            "actions",
                                                            "delete",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    صرافي لري کول
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.bank
                                                            .reports.list
                                                    }
                                                    name="list-bank"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "bank",
                                                            "reports",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    صرافي لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.bank
                                                            .reports.ledger
                                                    }
                                                    name="ledger-bank"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "bank",
                                                            "reports",
                                                            "ledger",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    صرافي کهاته کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    دخل برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .actions.add
                                                    }
                                                    name="add-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "actions",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .actions.edit
                                                    }
                                                    name="edit-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "actions",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل تغیر کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .actions.delete
                                                    }
                                                    name="delete-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "actions",
                                                            "delete",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل لري کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .actions
                                                            .opening_closing
                                                    }
                                                    name="opening_closing-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "actions",
                                                            "opening_closing",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل خلاصول / بندول کول
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .reports.list
                                                    }
                                                    name="list-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "reports",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.till
                                                            .reports.open_closed
                                                    }
                                                    name="open_closed-till"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "till",
                                                            "reports",
                                                            "open_closed",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    دخل ورځني راپور کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    د تنظیماتو برخه
                                </Typography>
                                <CardContent>
                                    <Sheet
                                        sx={{
                                            display: "flex",
                                        }}
                                    >
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .users.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "users",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    یوزر اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .users.list
                                                    }
                                                    name="list-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "users",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    یوزر لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .users.edit
                                                    }
                                                    name="edit-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "users",
                                                            "edit",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    یوزر تغیر کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .users
                                                            .branch_control
                                                    }
                                                    name="branch_control-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "users",
                                                            "branch_control",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    یوزر صلاحیتونه اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .currencies.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "currencies",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    اسعار اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .currencies.list
                                                    }
                                                    name="list-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "currencies",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    اسعار لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .currencies
                                                            .add_exchange_rate
                                                    }
                                                    name="add_exchange_rate-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "currencies",
                                                            "add_exchange_rate",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    اسعارو نرخونو کنټرول
                                                </span>
                                            </label>
                                        </Sheet>

                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .branches.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "branches",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    څانګي اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .branches.list
                                                    }
                                                    name="list-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "branches",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    څانګي لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .ei_codes.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "ei_codes",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کودونه اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .ei_codes.list
                                                    }
                                                    name="list-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "ei_codes",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    کودونه لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .visa_types.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "visa_types",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي ‌ډول اضافه کول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .visa_types.list
                                                    }
                                                    name="list-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "visa_types",
                                                            "list",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    ویزي ‌ډول لیست کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.settings
                                                            .system_infos.add
                                                    }
                                                    name="add-settings"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "settings",
                                                            "system_infos",
                                                            "add",
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    سیسټم معلوماتو تغیرول
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                            <Card>
                                <Typography level="body-lg" fontWeight={"bold"}>
                                    عمومي صلاحیتونو برخه
                                </Typography>
                                <CardContent>
                                    <Sheet sx={{ display: "flex" }}>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc
                                                            .add_journal_entry
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "add_journal_entry",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    روزنامچه رسول
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc
                                                            .view_journal_entry
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "view_journal_entry",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    روزنامچه راپور کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc
                                                            .user_logs
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "user_logs",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    یوزرانو فعالیتونه کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                        <Sheet
                                            sx={{
                                                width: "50%",
                                                display: "flex",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc
                                                            .balance_sheet
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "balance_sheet",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    بیلانس شیټ کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc.loans
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "loans",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    پورونه راپور کتل
                                                </span>
                                            </label>
                                            <label
                                                style={{ width: "100%" }}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    checked={
                                                        usePrivileges.misc
                                                            .other_branches_control
                                                    }
                                                    name="add-misc"
                                                    onChange={(e) =>
                                                        onAuthorityChange(
                                                            e.target.checked,
                                                            "misc",
                                                            "other_branches_control",
                                                            "",
                                                            true,
                                                        )
                                                    }
                                                />
                                                <span className="ms-2 text-sm text-gray-600">
                                                    نورو څانګو ډیتا کتل
                                                </span>
                                            </label>
                                        </Sheet>
                                    </Sheet>
                                </CardContent>
                            </Card>
                        </Sheet>
                        <Sheet
                            sx={{
                                pt: 1,
                            }}
                        >
                            <Button
                                loading={useForm.loading}
                                onClick={() => onSubmit()}
                            >
                                ثبت
                            </Button>
                        </Sheet>
                    </DialogContent>
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
                </ModalDialog>
            </Modal>
        </>
    );
}

export default ViewUserPrivilege;
