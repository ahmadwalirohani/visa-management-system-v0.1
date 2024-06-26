import { Head } from "@inertiajs/react";
import { Box, Card, ColorPaletteProp, Grid, Snackbar } from "@mui/joy";
import AddVisaInfo from "./Partials/AddVisaInfo";
import AddVisaAdvancePayment from "./Partials/AddVisaAdvancePayment";
import AddVisaPrintPreview from "./Partials/AddVisaPrintPreview";
import { useEffect, useState } from "react";
import {
    GetCustomersAsItems,
    GetVisaLatestID,
    GetVisaTypes,
    LoadCurrencies,
} from "@/Utils/FetchResources";
import { IVisaProps } from "@/types";
import { SendActionRequest } from "@/Utils/helpers";
import { AxiosError } from "axios";
import Printer from "@/Utils/Printer";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import axiosInstance from "../Plugins/axiosIns";

interface ICurrency {
    id: number;
    name: string;
}

function AddVisa() {
    const [useCurrencies, setCurrencies] = useState<ICurrency[]>([]);
    const [useCustomers, setCustomers] = useState<Array<object>>([]);
    const [useVisaTypes, setVisaTypes] = useState<Array<object>>([]);
    const [usePostLoading, setPostLoading] = useState<boolean>(false);
    const [useVisaId, setVisaId] = useState<number>();

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const [useVisaForm, setVisaForm] = useState<IVisaProps>({
        basic_type: "normal",
        visa_type: 0,
        visa_entrance_type: null,
        customer: null,
        province: "",
        job: "",
        passport_no: "",
        block_no: "",
        currency: 0,
        price: 0,
        name: "",
        remarks: "",
        visa_qty: 1,
        booked_date: "",
        ordered_date: "",
    });

    const [useAdvancePayment, setAdvancePayment] = useState({
        till: 0,
        advance_amount: 0,
        premarks: "",
    });

    const fetchVisaTypes = () => {
        GetVisaTypes(function (types: Array<object>): void {
            setVisaTypes(types);
        });
    };

    const fetchCustomers = () => {
        GetCustomersAsItems(function (customers: Array<object>): void {
            setCustomers(customers);
        });
    };

    const fetchVisaId = () => {
        GetVisaLatestID((id: any): void => {
            setVisaId(id as number);
        });
    };

    const fetchCurrencies = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies as ICurrency[]);

            setVisaForm((prevState) => ({
                ...prevState,
                currency:
                    (currencies as ICurrency[]).filter(
                        (c: any) => c.is_default == 1,
                    )[0]?.id || 0,
            }));
        });
    };

    const handleInputChange = (
        newValue: any,
        field: string,
        isAdvancePayment: boolean = false,
    ): void => {
        if (!isAdvancePayment)
            setVisaForm((prevState) => ({
                ...prevState,
                [field]: newValue,
            }));
        else
            setAdvancePayment((prevState) => ({
                ...prevState,
                [field]: newValue,
            }));
    };

    const onSubmit = () => {
        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "create_new_visa",
                _validation_class: "CreateVisa",
            },
            Object.assign({}, useVisaForm, useAdvancePayment),
        );
        setPostLoading(true);

        axiosInstance
            .post(Config.url, Config.payload)
            .then((): void => {
                setSnackbar({
                    msg: "ویزي په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });

                Printer(
                    `/print/visa-label-format/${useVisaId}/${useVisaForm.basic_type == "urgent" ? 1 : 0}`,
                    {
                        name: useVisaForm.name,
                        customer: useVisaForm.customer?.name,
                        type: `${
                            (
                                useVisaTypes.filter(
                                    (t: any) => t.id == useVisaForm.visa_type,
                                )[0] as any
                            )?.name
                        } ${(useVisaForm.visa_entrance_type as any)?.name}`,
                        dynamic_type: useVisaForm.block_no ? "بلاک" : "تفصیل",
                        dynamic_value: useVisaForm.block_no
                            ? useVisaForm.block_no
                            : useVisaForm.remarks,
                    },
                ).then(() => resetAll());
            })
            .catch((Error: AxiosError<any>): void => {
                setSnackbar({
                    msg: Error.response?.data.message,
                    state: "danger",
                    is_open: true,
                });
            })
            .finally(() => setPostLoading(false));
    };

    const resetAll = (): void => {
        fetchVisaId();

        setVisaForm((prevState) => ({
            ...prevState,
            ...{
                customer: null,
                province: "",
                job: "",
                passport_no: "",
                block_no: "",
                currency: 0,
                price: 0,
                name: "",
                remarks: "",
            },
            ...(prevState.visa_qty <= 1
                ? { visa_entrance_type: null, visa_type: 0, visa_qty: 0 }
                : { visa_qty: prevState.visa_qty - 1 }),
        }));

        setAdvancePayment({
            till: 0,
            advance_amount: 0,
            premarks: "",
        });
    };

    const { privileges } = useUserBranchesContext();

    useEffect(() => {
        fetchCustomers();
        fetchVisaTypes();
        fetchCurrencies();
        fetchVisaId();
    }, []);
    return (
        <>
            <Head title="ویزي ثبت" />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: { xs: "calc(12px + var(--Header-height))", md: 5 },
                    pb: { xs: 2, sm: 2, md: 1 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100dvh",
                    gap: 1,
                    overflow: "auto",
                }}
            >
                {privileges.visa.actions.add && (
                    <Card sx={{ flex: 1, width: "100%" }}>
                        <Box
                            sx={{
                                position: "sticky",
                                top: { md: 5 },
                                bgcolor: "background.body",
                            }}
                        >
                            <Box
                                sx={{
                                    height: "85dvh",
                                    overflow: {
                                        md: "hidden",
                                        sm: "auto",
                                        xl: "hidden",
                                    },
                                }}
                            >
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{
                                        alignItems: "flex-end",
                                    }}
                                >
                                    <AddVisaInfo
                                        formData={useVisaForm}
                                        onChange={handleInputChange}
                                        loading={usePostLoading}
                                        customers={useCustomers}
                                        visa_types={useVisaTypes}
                                        currencies={useCurrencies}
                                        onSubmit={onSubmit}
                                    />
                                    <AddVisaAdvancePayment
                                        formData={useAdvancePayment}
                                        onChange={handleInputChange}
                                        selectedCurrency={useVisaForm.currency}
                                        selectedCustomer={
                                            useVisaForm.customer as number
                                        }
                                        price={useVisaForm.price}
                                    />
                                    <AddVisaPrintPreview
                                        formData={useVisaForm}
                                        visaId={useVisaId}
                                        visaType={
                                            (
                                                useVisaTypes.filter(
                                                    (t: any) =>
                                                        t.id ==
                                                        useVisaForm.visa_type,
                                                )[0] as any
                                            )?.name
                                        }
                                        visaEntranceType={
                                            (
                                                useVisaForm.visa_entrance_type as any
                                            )?.name
                                        }
                                    />
                                </Grid>
                            </Box>
                        </Box>
                    </Card>
                )}
            </Box>

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
        </>
    );
}

export default AddVisa;
