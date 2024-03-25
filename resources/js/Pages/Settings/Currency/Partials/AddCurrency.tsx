import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Snackbar from "@mui/joy/Snackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import { Divider, Table } from "@mui/joy";
import axios, { AxiosError } from "axios";
import { SendActionRequest } from "@/Utils/helpers";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    symbol: HTMLInputElement;
}
interface CurrencyAdditionFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

interface FormProps {
    formValidation: {
        name: {
            msg: string;
            state: boolean;
        };
        symbol: {
            msg: string;
            state: boolean;
        };
    };
    onSubmit(e: FormEvent): void;
    useSnackbar: {
        msg: string;
        is_open: boolean;
        state: string;
    };
    closeSnackbar(): void;
    formRef: React.MutableRefObject<HTMLFormElement | null>;
    formInfo: {
        loading: boolean;
        is_update: boolean;
        currency_id: null | number;
    };
    resetForm(): void;
    currencies: Array<object>;
}

function AddCurrency({
    formValidation,
    onSubmit,
    formRef,
    formInfo,
    resetForm,
    currencies,
}: FormProps) {
    const [useExchangeRates, setExchangeRates] = useState<Array<object>>([]);
    const [useLoading, setLoading] = useState<boolean>(false);
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const onRatesSubmit = () => {
        setLoading(true);

        const Config = SendActionRequest(
            {
                _class: "SettingsLogics",
                _method_name: "add_currency_exchange_rates",
                _validation_class: null,
            },
            {
                rates: useExchangeRates,
            },
        );

        axios
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: "نرخونه په بریالي سره ثبت سول",
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
            })
            .finally(() => setLoading(false));
    };

    const handleInputChange = (
        newValue: any,
        index: number,
        field: string,
    ): void => {
        const rates = [...useExchangeRates];

        rates[index] = {
            ...rates[index],
            [field]: newValue,
        };

        setExchangeRates(rates);
    };

    useEffect(() => {
        setExchangeRates([
            ...currencies.map((currency: any) => ({
                id: currency.id,
                is_default: currency.is_default,
                name: currency.name,
                amount: currency.is_default == 1 ? 1 : currency.amount,
                rate: currency.is_default == 1 ? 1 : currency.rate,
            })),
        ]);
    }, [currencies]);
    return (
        <>
            <Typography level="h4" sx={{ mb: 3 }}>
                اسعار او نرخونه
            </Typography>

            <form
                onSubmit={(
                    event: React.FormEvent<CurrencyAdditionFormElement>,
                ) => onSubmit(event)}
                ref={formRef}
                method="post"
            >
                <FormControl sx={{ mt: 2 }} error={formValidation.name.state}>
                    <Input name="name" placeholder="اسعار نوم *" />
                    {formValidation.name.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.name.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl sx={{ mt: 2 }} error={formValidation.symbol.state}>
                    <Input name="symbol" placeholder="اسعار سمبول *" />
                    {formValidation.symbol.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.symbol.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    variant={formInfo.is_update ? "outlined" : "solid"}
                    style={{ marginTop: 20 }}
                    loading={formInfo.loading}
                >
                    {formInfo.is_update ? "تغیر" : "ثبت"}
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

            <Divider sx={{ mb: 2, mt: 3 }} />

            <Table
                variant="soft"
                sx={{
                    "& tr  > *": {
                        textAlign: "center",
                    },
                }}
            >
                <thead>
                    <tr>
                        <th style={{ width: 50 }}>#</th>
                        <th>اسعار</th>
                        <th>مبلغ</th>
                        <th>معادل نرخ</th>
                    </tr>
                </thead>
                <tbody>
                    {useExchangeRates.map((currency: any, index: number) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{currency.name}</td>
                            <td>
                                <Input
                                    value={currency.amount}
                                    size="sm"
                                    type="number"
                                    disabled={currency.is_default}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        handleInputChange(
                                            e.target.value,
                                            index,
                                            "amount",
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <Input
                                    value={currency.rate}
                                    size="sm"
                                    type="number"
                                    disabled={currency.is_default}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        handleInputChange(
                                            e.target.value,
                                            index,
                                            "rate",
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Divider sx={{ mb: 2, mt: 3 }} />

            <Button onClick={onRatesSubmit} loading={useLoading} variant="soft">
                ثبت
            </Button>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={2000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() =>
                    setSnackbar((prevState) => ({
                        ...prevState,
                        is_open: false,
                    }))
                }
            >
                {useSnackbar.msg}
            </Snackbar>
        </>
    );
}

export default AddCurrency;
