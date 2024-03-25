import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormLabel,
    Grid,
    Select,
    Sheet,
    Typography,
    Table,
    Snackbar,
    ColorPaletteProp,
    Option,
} from "@mui/joy";
import { useEventEmitter } from "../ProcessVisa";
import { useEffect, useState } from "react";
import VisaExpenseDeleteConfirm from "./VisaExpenseDeleteConfirm";
import VisaExpenseEdit from "./VisaExpenseEdit";
import { GetTills, LoadCurrencies } from "@/Utils/FetchResources";
import Row from "../Components/Row";
import Printer from "@/Utils/Printer";
import { SendActionRequest } from "@/Utils/helpers";
import axios, { AxiosError } from "axios";

interface IExpenseType {
    id: number;
    amount: number;
    currency_id: number;
    name: string;
    visa_id: number;
    currency: {
        id: number;
        name: string;
        symbol: string;
    };
}

interface IVisa {
    visa_no: number;
    id: number;
    price: number;
    advance_payment: number;
    residence: string;
    serial_no: string;
    profit: number;
    name: string;
    customer: string;
    type: string;
    created_at: string;
    currency: {
        id: number;
        name: string;
        symbol: string;
    };
    passport_no: string;
    expense: number;
    currency_id: number;
    customer_id: number;
    expenses: IExpenseType[];
}

let currencies: Array<any> = [];

function ProcessVisaProcessingSection() {
    const { addEventListener, emitEvent } = useEventEmitter();
    const [useVisas, setVisas] = useState<IVisa[]>([]);
    const [useCurrencies, setCurrencies] = useState<Array<any>>([]);
    const [useTills, setTills] = useState<Array<any>>([]);
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });
    const [useDataModel, setDataModel] = useState({
        deleteDialog: false,
        editDialog: false,
        id: 0,
        currency: 0,
        name: "",
        amount: 0,
        till_id: 0,
        loading: false,
    });

    const handleOnVisaSelectEvent = (visas: Array<any>) => {
        setVisas([
            ...visas.map(
                (visa: any) =>
                    ({
                        visa_no: visa.visa_no,
                        id: visa.id,
                        name: visa.name,
                        currency: visa.currency,
                        currency_id: visa.currency_id,
                        customer_id: visa.customer_id,
                        passport_no: visa.passport_no,
                        customer: visa.customer.name,
                        type: visa.type.name,
                        price: visa.price,
                        advance_payment: visa.paid_amount,
                        residence: "",
                        serial_no: "",
                        profit: calcVisaProfit(visa.price, visa.currency_id),
                        expenses: visa.expenses,
                        expense: calcVisaExpense(visa.expenses),
                    }) as IVisa,
            ),
        ]);
    };

    const calcVisaExpense = (expenses: Array<any>): number => {
        const defaultCurrency = currencies.filter(
            (c: any) => c.is_default == 1,
        )[0] as { id: number };
        let totalExpenses = 0;

        expenses.forEach((e: any) => {
            if (e.currency_id == defaultCurrency.id) {
                totalExpenses += Number(e.amount);
            } else {
                currencies.forEach((c: any) => {
                    if (c.id == e.currency_id) {
                        totalExpenses +=
                            (c.rate / c.amount / 1) * Number(e.amount);
                    }
                });
            }
        });

        return +Number(totalExpenses).toFixed(2);
    };
    const calcVisaProfit = (price: number, currency_id: number): number => {
        let eprice = price;
        currencies.forEach((c: any) => {
            if (c.id == currency_id) {
                return (eprice = (c.rate / c.amount) * price);
            }
        });

        return +eprice.toFixed(2);
    };

    const openDeleteDialog = (
        state: any,
        is_updated: boolean,
        payload: any = null,
    ) => {
        setDataModel((prevState) => ({
            ...prevState,
            deleteDialog: state as boolean,
            ...(payload
                ? {
                      id: payload.id,
                  }
                : {}),
        }));

        if (is_updated) {
            setSnackbar({
                msg: "عملیه په بریالي سره اجرا سول",
                state: "success",
                is_open: true,
            });

            const newVisas = [...useVisas];

            setVisas([
                ...newVisas.map((prevState) => ({
                    ...prevState,
                    expenses: prevState.expenses.filter(
                        (e) => e.id !== useDataModel.id,
                    ),
                    expense: calcVisaExpense(
                        prevState.expenses.filter(
                            (e) => e.id !== useDataModel.id,
                        ),
                    ),
                })),
            ]);
        }
    };

    const openEditDialog = (
        state: boolean,
        is_updated: boolean = false,
        payload: any = null,
    ): void => {
        setDataModel((prevState) => ({
            ...prevState,
            editDialog: state as boolean,
            ...(payload
                ? {
                      id: payload.id,
                      currency: payload.currency,
                      amount: payload.amount,
                      name: payload.name,
                  }
                : {}),
        }));
        if (is_updated) {
            setSnackbar({
                msg: "عملیه په بریالي سره اجرا سول",
                state: "success",
                is_open: true,
            });

            const newVisas = [...useVisas];

            const editExpenses = (prevState: IVisa): IExpenseType[] => {
                return prevState.expenses.map((prevExpense) => {
                    if (prevExpense.id == useDataModel.id) {
                        return {
                            ...prevExpense,
                            amount: payload.amount as number,
                            name: payload.name as string,
                            currency_id: payload.currency_id as number,
                            currency: useCurrencies
                                .filter((c: any) => c.id == payload.currency_id)
                                .map((c: any) => ({
                                    id: c.id,
                                    name: c.name,
                                    symbol: c.symbol,
                                }))[0],
                        };
                    }

                    return { ...prevExpense };
                });
            };
            setVisas([
                ...newVisas.map((prevState) => ({
                    ...prevState,
                    expenses: editExpenses(prevState),
                    expense: calcVisaExpense(editExpenses(prevState)),
                })),
            ]);
        }
    };

    const handleOnChange = (
        newValue: any,
        field: string,
        index: number,
    ): void => {
        const copyVisas = [...useVisas];
        copyVisas[index] = {
            ...copyVisas[index],
            ...(field == "price"
                ? {
                      profit: calcVisaProfit(
                          newValue as number,
                          copyVisas[index].currency_id,
                      ) as number,
                  }
                : {}),
            [field]: newValue,
        };

        setVisas(copyVisas);
    };

    const onPrint = () => {
        Printer("/print/visa-processed-format", {
            title: "نوي جاري سوي ویزي",
            info: "",
            header: function () {
                return `
                <tr>
                    <th>#</th>
                    <th>لیبل</th>
                    <th>پاسپورټ</th>
                    <th>نام و تخلص</th>
                    <th>مربوط</th>
                    <th>ویزه نوع</th>
                    <th>قیمت</th>
                    <th>اقامت</th>
                    <th>شماره سند</th>
                    <th>مصارف</th>
                </tr>
                `;
            },
            data: function () {
                let _Rows = "";

                useVisas.forEach((visa: any, index: number) => {
                    _Rows += "<tr>";
                    _Rows += `<td>${index + 1}</td>`;
                    _Rows += `<td>${visa.visa_no}</td>`;
                    _Rows += `<td>${visa.passport_no}</td>`;
                    _Rows += `<td>${visa.name}</td>`;
                    _Rows += `<td>${visa.customer}</td>`;
                    _Rows += `<td>${visa.type}</td>`;
                    _Rows += `<td>${visa.price} ${useCurrencies.filter((c: any) => c.id == visa.currency_id)[0].symbol}</td>`;
                    _Rows += `<td>${visa.residence}</td>`;
                    _Rows += `<td>${visa.serial_no}</td>`;
                    _Rows += `<td>${visa.expense} ${useCurrencies.filter((c: any) => c.is_default == 1)[0].symbol}</td>`;
                    _Rows += "</tr>";
                });

                return _Rows;
            },
        });
    };

    const onSubmit = () => {
        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "proceed_pending_visas",
                _validation_class: null,
            },
            {
                till_id: useDataModel.till_id,
                visas: useVisas,
                expenses: useCurrencies
                    .map((currency: any) => ({
                        amount: useVisas.reduce(
                            (p, c) =>
                                p +
                                Number(
                                    c.expenses
                                        .filter(
                                            (e) => e.currency_id == currency.id,
                                        )
                                        .reduce(
                                            (ep, ec) => ep + Number(ec.amount),
                                            0,
                                        ),
                                ),
                            0,
                        ),
                        currency_id: currency.id,
                    }))
                    .filter((e) => e.amount != 0),
            },
        );

        setDataModel((prevState) => ({ ...prevState, loading: true }));

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: "عملیه په بریالي سره اجرا سول",
                    state: "success",
                    is_open: true,
                });
            })
            .catch((Error: AxiosError<any>) => {
                setSnackbar({
                    msg: Error.response?.data.message,
                    state: "danger",
                    is_open: true,
                });

                setVisas([]);

                emitEvent("reloadPendingVisas", []);
            })
            .finally(() =>
                setDataModel((prevState) => ({
                    ...prevState,
                    loading: false,
                })),
            );
    };

    useEffect(() => {
        LoadCurrencies(function (_currencies: Array<object>) {
            currencies = _currencies;
            setCurrencies(_currencies);
        });

        GetTills(function (_tills: Array<any>) {
            setDataModel((prevState) => ({
                ...prevState,
                till_id: _tills[0]?.id,
            }));
            setTills(_tills);
        });

        addEventListener("onVisaSelect", handleOnVisaSelectEvent);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener("onVisaSelect", handleOnVisaSelectEvent);
        };
    }, []);

    return (
        <Grid xl={6} sm={12} md={6}>
            <Card
                sx={{
                    height: "85dvh",
                }}
            >
                <CardContent>
                    <Sheet
                        sx={{
                            height: "50dvh",
                            overflow: "auto",
                            width: "100%",
                        }}
                    >
                        <Table
                            size="sm"
                            variant="soft"
                            hoverRow
                            sx={{
                                "& tr > *": {
                                    textAlign: "center",
                                    width: "fit-content",
                                },
                                "& tr > .mainTh": {
                                    position: "sticky",
                                    top: 0,
                                    zIndex: "var(--joy-zIndex-table)",
                                },
                                tableLayout: "auto",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th className="mainTh"></th>
                                    <th className="mainTh">#</th>
                                    <th
                                        className="mainTh"
                                        style={{ width: 50 }}
                                    >
                                        لیبل
                                    </th>
                                    <th
                                        className="mainTh"
                                        style={{ width: "100 px !important" }}
                                    >
                                        قیمت
                                    </th>
                                    <th className="mainTh">اقامت</th>
                                    <th className="mainTh">شماره سند</th>
                                    <th className="mainTh">مصارف</th>
                                    <th
                                        className="mainTh"
                                        style={{ width: 100 }}
                                    >
                                        مفاد
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {useVisas.map((visa: IVisa, index: number) => (
                                    <Row
                                        visa={visa}
                                        index={index}
                                        key={index}
                                        initialOpen={false}
                                        onChange={handleOnChange}
                                        openDeleteDialog={openDeleteDialog}
                                        openEditDialog={openEditDialog}
                                        visaList={useVisas}
                                        defaultCurrency={
                                            useCurrencies.filter(
                                                (c: any) => c.is_default == 1,
                                            )[0]
                                        }
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                    <Table>
                        <tr>
                            <th colSpan={6}></th>

                            <td>
                                <Typography fontWeight="bold" level="body-md">
                                    {new Intl.NumberFormat("en").format(
                                        useVisas.reduce(
                                            (p, c) => p + Number(c.expense),
                                            0,
                                        ),
                                    )}
                                </Typography>
                            </td>
                            <td>
                                <Typography fontWeight="bold" level="body-md">
                                    {new Intl.NumberFormat("en").format(
                                        useVisas.reduce(
                                            (p, c) =>
                                                p +
                                                Number(c.profit - c.expense),
                                            0,
                                        ),
                                    )}
                                </Typography>
                            </td>
                        </tr>
                    </Table>

                    <Box gap={2} display={"flex"}>
                        <Sheet
                            sx={{
                                width: "30%",
                            }}
                        >
                            <FormControl>
                                <FormLabel>دخل انتخاب</FormLabel>
                                <Select
                                    value={useDataModel.till_id}
                                    onChange={(e: any, newValue: any) =>
                                        setDataModel((p) => ({
                                            ...p,
                                            till_id: newValue,
                                        }))
                                    }
                                >
                                    {useTills.map(
                                        (till: any, index: number) => (
                                            <Option key={index} value={till.id}>
                                                {till.name}
                                            </Option>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                        </Sheet>
                        <Sheet
                            sx={{
                                width: "70%",
                                height: "15dvh",
                                overflow: "auto",
                            }}
                        >
                            <Table
                                size="sm"
                                stickyFooter
                                stickyHeader
                                variant="outlined"
                                sx={{
                                    "& tr > *": {
                                        textAlign: "right",
                                    },
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>اسعار</th>
                                        <th>جمله مصارف</th>
                                        <th>دخل موجودي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {useCurrencies.map(
                                        (currency: any, index: number) => (
                                            <tr key={index}>
                                                <th scope="row">
                                                    {currency.name}
                                                </th>
                                                <td>
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(
                                                        useVisas.reduce(
                                                            (p, c) =>
                                                                p +
                                                                Number(
                                                                    c.expenses
                                                                        .filter(
                                                                            (
                                                                                e,
                                                                            ) =>
                                                                                e.currency_id ==
                                                                                currency.id,
                                                                        )
                                                                        .reduce(
                                                                            (
                                                                                ep,
                                                                                ec,
                                                                            ) =>
                                                                                ep +
                                                                                Number(
                                                                                    ec.amount,
                                                                                ),
                                                                            0,
                                                                        ),
                                                                ),
                                                            0,
                                                        ),
                                                    )}{" "}
                                                    {currency.symbol}
                                                </td>
                                                <td>
                                                    {useDataModel.till_id > 0 &&
                                                        new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            useTills
                                                                .filter(
                                                                    (t: any) =>
                                                                        t.id ==
                                                                        useDataModel.till_id,
                                                                )[0]
                                                                ?.balancies.filter(
                                                                    (b: any) =>
                                                                        b.currency_id ==
                                                                        currency.id,
                                                                )[0]?.balance ||
                                                                0,
                                                        )}{" "}
                                                    {currency.symbol}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </Table>
                        </Sheet>
                    </Box>
                </CardContent>
                <CardActions buttonFlex="0 0 125 1">
                    <Button
                        type="submit"
                        disabled={
                            useVisas.length == 0 || useDataModel.till_id == 0
                        }
                        loading={useDataModel.loading}
                        fullWidth
                        onClick={() => onSubmit()}
                    >
                        ثبت
                    </Button>
                    <Button
                        onClick={() => onPrint()}
                        fullWidth
                        variant="outlined"
                    >
                        چاپ
                    </Button>
                    <Button fullWidth variant="soft">
                        پاکول
                    </Button>
                </CardActions>
            </Card>

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

            <VisaExpenseDeleteConfirm
                id={useDataModel.id}
                openState={useDataModel.deleteDialog}
                setOpenState={openDeleteDialog}
            />

            <VisaExpenseEdit
                id={useDataModel.id}
                openState={useDataModel.editDialog}
                setOpenState={openEditDialog}
                currencies={useCurrencies}
                name={useDataModel.name}
                currency={useDataModel.currency}
                amount={useDataModel.amount}
            />
        </Grid>
    );
}

export default ProcessVisaProcessingSection;
