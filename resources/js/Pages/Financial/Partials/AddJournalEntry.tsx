import { LoadCurrencies } from "@/Utils/FetchResources";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    ColorPaletteProp,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Snackbar,
    Switch,
    Table,
    Textarea,
    Typography,
    VariantProp,
} from "@mui/joy";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import ViewVisaSelection from "./ViewVisaSelection";

type TType = "credit" | "debit";

const creditDebitTypes: Array<{
    name: string;
    label: string;
}> = [
    {
        name: "Till",
        label: "دخل",
    },
    {
        name: "Bank",
        label: "بانک / صرافي",
    },
    {
        name: "Customer",
        label: "مشتري / شرکت",
    },
    {
        name: "Employee",
        label: "کارمند",
    },
    {
        name: "Expense",
        label: "مصرف",
    },
    {
        name: "Income",
        label: "عاید",
    },
    {
        name: "Extra",
        label: "متفرقه",
    },
];

let _currencies: Array<any> = [];

function AddJournalEntry() {
    const [useCreditAccounts, setCreditAccounts] = useState<Array<any>>([]);
    const [useDebitAccounts, setDebitAccounts] = useState<Array<any>>([]);
    const [useJournalForm, setJournalForm] = useState({
        creditType: null,
        debitType: null,
        creditAccount: {},
        debitAccount: {},
        creditCurrency: {
            id: 0,
            name: "",
            rate: 0,
            amount: 0,
            symbol: "",
            is_default: 0,
        },
        debitCurrency: {
            id: 0,
            name: "",
            rate: 0,
            amount: 0,
            symbol: "",
            is_default: 0,
        },
        exchange_rate: 0,
        exchanged_amount: 0,
        amount: 0,
        exchange_type: false,
        remarks: "",
        creditLabel: "",
        debitLabel: "",
    });
    const [selectedVisas, setSelectedVisas] = useState<Array<any>>([]);
    const [useFormSettings, setFormSettings] = useState({
        creditAccountLoader: false,
        debitAccountLoader: false,
        creditOldBalance: 0,
        debitOldBalance: 0,
        viewVisaDialog: false,
        loading: false,
    });
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const onTransactionType = (type: TType, value: any): any => {
        // clear collections when on change for preventing conflict
        (function () {
            if (type == "credit") {
                setCreditAccounts([]);
                setJournalForm((p) => ({
                    ...p,
                    creditAccount: {},
                    creditLabel: "",
                }));
            } else {
                setDebitAccounts([]);
                setJournalForm((p) => ({
                    ...p,
                    debitAccount: {},
                    creditLabel: "",
                }));
            }
        })();

        if (!value) return 0;
        else if (value.name == "Extra") {
            if (type == "credit")
                setCreditAccounts([
                    {
                        label: "متفرقه حساب",
                        id: 0,
                    },
                ]);
            else
                setDebitAccounts([
                    {
                        label: "متفرقه حساب",
                        id: 0,
                    },
                ]);
            return 0;
        } else {
            setFormSettings((prevState) => ({
                ...prevState,
                [type + "AccountLoader"]: true,
            }));
            axios
                .get(
                    SendResourceRequest({
                        _class: "FinancialResources",
                        _method_name: `get_${(value.name as string).toLowerCase()}_accounts`,
                    }),
                )
                .then((Accounts: AxiosResponse<Array<any>>) => {
                    if (type == "credit") setCreditAccounts(Accounts.data);
                    else setDebitAccounts(Accounts.data);
                })
                .finally(() =>
                    setFormSettings((prevState) => ({
                        ...prevState,
                        [type + "AccountLoader"]: false,
                    })),
                );
        }

        // getAccountBalance(useJournalForm.creditAccount, "credit");
        // getAccountBalance(useJournalForm.debitAccount, "debit");
    };

    const getAccountBalance = () => {
        setFormSettings((prevs) => ({
            ...prevs,
            creditOldBalance:
                (
                    useJournalForm.creditAccount as { balancies: Array<any> }
                )?.balancies?.filter(
                    (b: any) =>
                        b.currency_id == useJournalForm.creditCurrency.id,
                )[0]?.balance || 0,
            debitOldBalance:
                (
                    useJournalForm.debitAccount as { balancies: Array<any> }
                )?.balancies?.filter(
                    (b: any) =>
                        b.currency_id == useJournalForm.debitCurrency.id,
                )[0]?.balance || 0,
        }));
    };

    const onCurrencyChange = (type: TType): void => {
        let index = _currencies.findIndex(
            (c: any) =>
                c.id ==
                (type == "credit"
                    ? useJournalForm.creditCurrency
                    : useJournalForm.debitCurrency
                ).id,
        );

        if (index == _currencies.length - 1) index = -1;
        setJournalForm((prevState) => ({
            ...prevState,
            [type + "Currency"]: _currencies[index + 1],
        }));
    };

    const handleOnChange = (newValue: any, field: string) => {
        setJournalForm((prevState) => ({
            ...prevState,
            [field]: newValue,
            ...(field == "creditAccount"
                ? { creditLabel: newValue?.label || "" }
                : { creditLabel: prevState.creditLabel }),
            ...(field == "debitAccount"
                ? { debitLabel: newValue?.label || "" }
                : { debitLabel: prevState.debitLabel }),
        }));
    };

    const calcNewBalancies = (): {
        credit_new_balance: number;
        debit_new_balance: number;
    } => {
        return {
            credit_new_balance:
                useJournalForm.creditType == "Employee"
                    ? useFormSettings.creditOldBalance -
                      useJournalForm.exchanged_amount
                    : useFormSettings.creditOldBalance +
                      useJournalForm.exchanged_amount,
            debit_new_balance:
                useJournalForm.debitType == "Employee"
                    ? useFormSettings.debitOldBalance + useJournalForm.amount
                    : useFormSettings.debitOldBalance - useJournalForm.amount,
        };
    };

    const openViewVisaDialog = (state: any) => {
        setFormSettings((prevState) => ({
            ...prevState,
            viewVisaDialog: state as boolean,
        }));
    };

    const onSubmit = () => {
        const Config = SendActionRequest(
            {
                _class: "FinancialLogics",
                _method_name: "add_journal_entry",
                _validation_class: "CreateJournalEntry",
            },
            Object.assign({}, useJournalForm, {
                selectedVisas: selectedVisas,
            }),
        );

        setFormSettings((prevState) => ({
            ...prevState,
            loading: true,
        }));

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: "عملیه په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });
                clearForm();
            })
            .catch((Error: AxiosError<any>) =>
                setSnackbar({
                    msg: Error.response?.data.message,
                    state: "danger",
                    is_open: true,
                }),
            )
            .finally(() => setFormSettings((p) => ({ ...p, loading: false })));
    };

    const clearForm = () => {
        setFormSettings({
            creditAccountLoader: false,
            debitAccountLoader: false,
            creditOldBalance: 0,
            debitOldBalance: 0,
            viewVisaDialog: false,
            loading: false,
        });

        setJournalForm({
            creditType: null,
            debitType: null,
            creditAccount: {},
            debitAccount: {},
            creditCurrency: _currencies.filter((c) => c.is_default == 1)[0],
            debitCurrency: _currencies.filter((c) => c.is_default == 1)[0],
            exchange_rate: 0,
            exchanged_amount: 0,
            amount: 0,
            exchange_type: false,
            remarks: "",
            creditLabel: "",
            debitLabel: "",
        });

        setSelectedVisas([]);
    };

    useEffect(() => {
        LoadCurrencies(function (currencies: any) {
            _currencies = currencies.map((c: any) => ({
                id: c.id,
                name: c.name,
                rate: c.rate,
                symbol: c.symbol,
                amount: c.amount,
                is_default: c.is_default,
            }));

            setJournalForm((prevState) => ({
                ...prevState,
                creditCurrency: _currencies.filter((c) => c.is_default == 1)[0],
                debitCurrency: _currencies.filter((c) => c.is_default == 1)[0],
            }));
        });
    }, []);
    useEffect(() => {
        const rate = +Number(
            useJournalForm.creditCurrency.amount /
                useJournalForm.creditCurrency.rate /
                (useJournalForm.debitCurrency.amount /
                    useJournalForm.debitCurrency.rate),
        ).toFixed(3);
        setJournalForm((p) => ({
            ...p,
            exchange_rate: rate,
            exchanged_amount: p.exchange_type
                ? +Number(p.amount / rate).toFixed(2)
                : +Number(p.amount * rate).toFixed(2),
            amount: selectedVisas.reduce(
                (p: number, c: any) =>
                    p +
                    exchangeCurrency(c.currency_id, c.price - c.paid_amount),
                0,
            ),
        }));

        getAccountBalance();
    }, [
        useJournalForm.creditAccount,
        useJournalForm.creditCurrency,
        useJournalForm.debitAccount,
        useJournalForm.debitCurrency,
    ]);
    useEffect(() => {
        setJournalForm((p) => ({
            ...p,
            exchanged_amount: p.exchange_type
                ? +Number(p.amount / useJournalForm.exchange_rate).toFixed(2)
                : +Number(p.amount * useJournalForm.exchange_rate).toFixed(2),
        }));

        getAccountBalance();
    }, [
        useJournalForm.amount,
        useJournalForm.exchange_rate,
        useJournalForm.exchange_type,
    ]);
    useEffect(() => {
        if (selectedVisas.length) {
            const customer = useDebitAccounts.filter(
                (c: any) => c.id == selectedVisas[0].customer.id,
            )[0];
            setJournalForm((prevState) => ({
                ...prevState,
                debitAccount: customer,
                debitLabel: customer.label,
                amount: selectedVisas.reduce(
                    (p: number, c: any) =>
                        p +
                        exchangeCurrency(
                            c.currency_id,
                            c.price - c.paid_amount,
                        ),
                    0,
                ),
            }));
        }
    }, [selectedVisas]);

    const exchangeCurrency = (currency: number, amount: number): number => {
        let exchanged = amount;

        if (currency == useJournalForm.debitCurrency.id) return exchanged;
        _currencies.forEach((c: any) => {
            if (c.id == currency) {
                exchanged =
                    (c.rate /
                        c.amount /
                        (useJournalForm.debitCurrency.rate /
                            useJournalForm.debitCurrency.amount)) *
                    Number(amount);
            }
        });

        return exchanged;
    };
    return (
        <Grid md={4}>
            <Card
                sx={{
                    m: 0,
                    height: { md: "90dvh", sm: "fit-content" },
                }}
            >
                <CardContent>
                    <Typography level="h4" mb={2}>
                        روزنامچه رسول
                    </Typography>
                    <Grid container spacing={1} sx={{ overflow: "hidden" }}>
                        <Grid md={6}>
                            <FormControl size="sm">
                                <FormLabel>رسید ډول</FormLabel>
                                <Autocomplete
                                    size="sm"
                                    options={creditDebitTypes}
                                    onChange={(e: any, newValue): any => {
                                        onTransactionType("credit", newValue);
                                        setJournalForm((prevState) => ({
                                            ...prevState,
                                            creditType: newValue?.name as any,
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={6}>
                            <FormControl size="sm">
                                <FormLabel>برد ډول</FormLabel>
                                <Autocomplete
                                    color="danger"
                                    options={creditDebitTypes}
                                    size="sm"
                                    onChange={(e: any, newValue): any => {
                                        onTransactionType("debit", newValue);
                                        setJournalForm((prevState) => ({
                                            ...prevState,
                                            debitType: newValue?.name as any,
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={12}>
                            <Divider />
                        </Grid>
                        <Grid md={8}>
                            <FormControl size="sm">
                                <FormLabel>رسید اکاونټ</FormLabel>
                                <Autocomplete
                                    options={useCreditAccounts}
                                    size="sm"
                                    inputValue={useJournalForm.creditLabel}
                                    onChange={(e: any, newValue: any) => {
                                        handleOnChange(
                                            newValue,
                                            "creditAccount",
                                        );
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={4}>
                            <Button
                                variant="solid"
                                color="primary"
                                fullWidth
                                size="sm"
                                sx={{ mt: 3 }}
                                onClick={() => onCurrencyChange("credit")}
                                loading={useFormSettings.creditAccountLoader}
                            >
                                {useJournalForm.creditCurrency.name}
                            </Button>
                        </Grid>
                        <Grid
                            md={12}
                            sx={{
                                display: "flex",
                                justifyContent: "space-around",
                            }}
                        >
                            <Chip color="success">
                                <b>زوړ حساب :</b>{" "}
                                <code>
                                    {new Intl.NumberFormat("en").format(
                                        useFormSettings.creditOldBalance,
                                    )}{" "}
                                    {useJournalForm.creditCurrency.symbol}
                                </code>
                            </Chip>

                            <Chip color="success">
                                <b>نوی حساب :</b>{" "}
                                <code>
                                    {new Intl.NumberFormat("en").format(
                                        calcNewBalancies().credit_new_balance,
                                    )}{" "}
                                    {useJournalForm.creditCurrency.symbol}
                                </code>
                            </Chip>
                        </Grid>
                        <Grid md={8}>
                            <FormControl size="sm">
                                <FormLabel>برد اکاونټ</FormLabel>
                                <Autocomplete
                                    options={useDebitAccounts}
                                    size="sm"
                                    inputValue={useJournalForm.debitLabel}
                                    onChange={(e: any, newValue: any) => {
                                        handleOnChange(
                                            newValue,
                                            "debitAccount",
                                        );
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={4}>
                            <Button
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="outlined"
                                color="primary"
                                size="sm"
                                onClick={() => onCurrencyChange("debit")}
                                loading={useFormSettings.debitAccountLoader}
                            >
                                {useJournalForm.debitCurrency.name}
                            </Button>
                        </Grid>
                        <Grid
                            md={12}
                            sx={{
                                display: "flex",
                                justifyContent: "space-around",
                            }}
                        >
                            <Chip color="danger">
                                <b>زوړ حساب :</b>{" "}
                                <code>
                                    {new Intl.NumberFormat("en").format(
                                        useFormSettings.debitOldBalance,
                                    )}{" "}
                                    {useJournalForm.debitCurrency.symbol}
                                </code>
                            </Chip>

                            <Chip color="danger">
                                <b>نوی حساب :</b>{" "}
                                <code>
                                    {new Intl.NumberFormat("en").format(
                                        calcNewBalancies().debit_new_balance,
                                    )}{" "}
                                    {useJournalForm.debitCurrency.symbol}
                                </code>
                            </Chip>
                        </Grid>
                        <Grid md={4}>
                            <FormControl size="sm">
                                <FormLabel>مبلغ</FormLabel>
                                <Input
                                    size="sm"
                                    value={useJournalForm.amount}
                                    type="number"
                                    endDecorator={
                                        useJournalForm.debitCurrency.symbol
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setJournalForm((p) => ({
                                            ...p,
                                            amount: Number(e.target.value),
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={2}>
                            <FormControl size="sm">
                                <FormLabel>نرخ</FormLabel>
                                <Input
                                    size="sm"
                                    value={useJournalForm.exchange_rate}
                                    type="number"
                                    disabled={
                                        useJournalForm.creditCurrency.id ==
                                        useJournalForm.debitCurrency.id
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setJournalForm((p) => ({
                                            ...p,
                                            exchange_rate: Number(
                                                e.target.value,
                                            ),
                                        }));
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={2}>
                            <FormControl>
                                <Switch
                                    checked={useJournalForm.exchange_type}
                                    disabled={
                                        useJournalForm.creditCurrency.id ==
                                        useJournalForm.debitCurrency.id
                                    }
                                    onChange={(e) => {
                                        handleOnChange(
                                            e.target.checked,
                                            "exchange_type",
                                        );
                                    }}
                                    color={
                                        useJournalForm.exchange_type
                                            ? "success"
                                            : "neutral"
                                    }
                                    variant={
                                        (useJournalForm.exchange_type
                                            ? "solid"
                                            : "outlined") as VariantProp
                                    }
                                    endDecorator={
                                        useJournalForm.exchange_type ? "/" : "x"
                                    }
                                    slotProps={{
                                        endDecorator: {
                                            sx: {
                                                minWidth: 24,
                                            },
                                        },
                                    }}
                                    sx={{
                                        mt: 3,
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={4}>
                            <FormControl size="sm">
                                <FormLabel>متبادل مبلغ</FormLabel>
                                <Input
                                    size="sm"
                                    value={useJournalForm.exchanged_amount}
                                    type="number"
                                    disabled={
                                        useJournalForm.creditCurrency.id ==
                                        useJournalForm.debitCurrency.id
                                    }
                                    endDecorator={
                                        useJournalForm.creditCurrency.symbol
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setJournalForm((p) => ({
                                            ...p,
                                            exchanged_amount: Number(
                                                e.target.value,
                                            ),
                                        }))
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={12}>
                            <FormControl size="sm">
                                <FormLabel>تفصیل</FormLabel>
                                <Textarea
                                    size="sm"
                                    minRows={1}
                                    value={useJournalForm.remarks}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>,
                                    ) =>
                                        setJournalForm((p) => ({
                                            ...p,
                                            remarks: e.target.value,
                                        }))
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={12}>
                            <Divider />
                        </Grid>
                        <Grid md={12}>
                            <Table
                                size="sm"
                                sx={{
                                    "& tr > th": {
                                        textAlign: "right",
                                        width: 150,
                                    },
                                    tableLayout: "auto",
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th> پیشکي ویزو مبلغ</th>
                                        <td>
                                            <b>
                                                {new Intl.NumberFormat(
                                                    "en",
                                                ).format(
                                                    selectedVisas.reduce(
                                                        (p: number, c: any) =>
                                                            p +
                                                            exchangeCurrency(
                                                                c.currency_id,
                                                                c.paid_amount,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </b>
                                            {
                                                useJournalForm.debitCurrency
                                                    .symbol
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th> انتخاب سوي ویزو مبلغ</th>
                                        <td>
                                            <b>
                                                {new Intl.NumberFormat(
                                                    "en",
                                                ).format(
                                                    selectedVisas.reduce(
                                                        (p: number, c: any) =>
                                                            p +
                                                            exchangeCurrency(
                                                                c.currency_id,
                                                                c.price,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </b>{" "}
                                            {
                                                useJournalForm.debitCurrency
                                                    .symbol
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th> د ویزو باقي حساب</th>
                                        <td>
                                            <b>
                                                {new Intl.NumberFormat(
                                                    "en",
                                                ).format(
                                                    selectedVisas.reduce(
                                                        (p: number, c: any) =>
                                                            p +
                                                            exchangeCurrency(
                                                                c.currency_id,
                                                                c.price -
                                                                    c.paid_amount,
                                                            ),
                                                        0,
                                                    ) - useJournalForm.amount,
                                                )}
                                            </b>{" "}
                                            {
                                                useJournalForm.debitCurrency
                                                    .symbol
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Button
                        loading={useFormSettings.loading}
                        onClick={() => onSubmit()}
                        fullWidth
                    >
                        ثبت
                    </Button>
                    <Button variant="soft">پاک</Button>
                    <Button color="neutral">چاپ</Button>
                    <Button
                        disabled={useJournalForm.debitType != "Customer"}
                        onClick={() => openViewVisaDialog(true)}
                        fullWidth
                        variant="outlined"
                    >
                        جاري ویزي
                    </Button>
                </CardActions>
            </Card>

            <ViewVisaSelection
                openState={useFormSettings.viewVisaDialog}
                setOpenState={openViewVisaDialog}
                selected={selectedVisas}
                setSelected={setSelectedVisas}
            />

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

export default AddJournalEntry;
