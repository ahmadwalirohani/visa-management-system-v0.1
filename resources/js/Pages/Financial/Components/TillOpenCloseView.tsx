import { getTillOpenCloseBalancies } from "@/Utils/FetchReports";
import { LoadCurrencies } from "@/Utils/FetchResources";
import { SendActionRequest } from "@/Utils/helpers";
import {
    Card,
    CardContent,
    DialogTitle,
    ModalDialog,
    Modal,
    DialogContent,
    Grid,
    FormControl,
    Input,
    FormLabel,
    Button,
    Table,
    CardActions,
    Textarea,
} from "@mui/joy";
import axios, { AxiosError } from "axios";
import moment from "jalali-moment";
import { ChangeEvent, useEffect, useState } from "react";
import { useEventEmitter } from "../Tills";

interface IProps {
    openState: {
        state: boolean;
        is_open: number;
        id: number;
        balancies: Array<any>;
    };
    showSnackbar(is_open: boolean, state: string, msg: string): void;
    setOpenState(state: boolean): void;
}

function TillOpenCloseView({ openState, setOpenState, showSnackbar }: IProps) {
    const [useCurrencies, setCurrencies] = useState<Array<any>>([]);
    const { emitEvent } = useEventEmitter();
    const [useFormData, setFormData] = useState({
        opened_date: moment().locale("fa").format("YYYY-MM-DD"),
        closed_date: moment().locale("fa").format("YYYY-MM-DD"),
        remarks: "",
        loading: false,
        id: null,
    });

    const onSubmit = () => {
        if (openState.id > 0) {
            setFormData((prev) => ({
                ...prev,
                loading: true,
            }));

            const Config = SendActionRequest(
                {
                    _class: "FinancialLogics",
                    _method_name: `${openState.is_open == 1 ? "close" : "open"}_till_balancies`,
                    _validation_class: null,
                },
                Object.assign({}, openState, {
                    balancies: useCurrencies,
                    model_id: useFormData.id,
                }),
            );
            axios
                .post(Config.url, Config.payload)
                .then(() => {
                    setOpenState(false);
                    emitEvent("ReloadTillsEvent", true);
                    showSnackbar(true, "success", "عملیه په بریا سره اجرا سول");
                })
                .catch((Error: AxiosError<any>) => {
                    showSnackbar(true, "danger", Error.response?.data.message);
                })
                .finally(() =>
                    setFormData((prev) => ({
                        ...prev,
                        loading: false,
                    })),
                );
        }
    };

    useEffect(() => {
        LoadCurrencies(function (currencies: Array<any>): void {
            setCurrencies(
                currencies.map((c: any) => ({
                    id: c.id,
                    symbol: c.symbol,
                    name: c.name,
                    old_balance: 0,
                    credit_amount: 0,
                    debit_amount: 0,
                    current_balance: 0,
                })),
            );
        });
    }, []);

    useEffect(() => {
        if (openState.is_open != 0) {
            getTillOpenCloseBalancies(
                openState.id,
                function (balancies: Array<any>): void {
                    setFormData((prev) => ({
                        ...prev,
                        id: (balancies as any).id,
                        opened_date: (balancies as any).opened_date,
                    }));
                    const _currencies = [...useCurrencies];
                    _currencies.forEach((c: any) => {
                        const indexOfCbalance = openState.balancies.findIndex(
                            (b: any) => b.currency_id == c.id,
                        );
                        const indexOfOBalance = (
                            (balancies as any).balancies as Array<any>
                        ).findIndex((b: any) => b.currency_id == c.id);

                        if (indexOfOBalance !== -1) {
                            c.old_balance = (balancies as any).balancies[
                                indexOfOBalance
                            ].opened_balance;
                            c.model_id = (balancies as any).balancies[
                                indexOfOBalance
                            ].id;
                            c.credit_amount = (balancies as any).balancies[
                                indexOfOBalance
                            ].credit_amount;
                            c.debit_amount = (balancies as any).balancies[
                                indexOfOBalance
                            ].debit_amount;
                        }
                        if (indexOfCbalance !== -1) {
                            c.current_balance =
                                openState.balancies[indexOfCbalance].balance;
                        }
                    });
                    setCurrencies(_currencies);
                },
            );
        } else {
            const _currencies = [...useCurrencies];
            _currencies.forEach((c: any) => {
                const indexOfbalance = openState.balancies.findIndex(
                    (b: any) => b.currency_id == c.id,
                );
                if (indexOfbalance !== -1) {
                    c.old_balance = openState.balancies[indexOfbalance].balance;
                }

                c.credit_amount = 0;
                c.debit_amount = 0;
                c.current_balance = 0;
            });
            setCurrencies(_currencies);
        }
    }, [openState]);

    return (
        <Modal
            open={openState.state}
            onClose={() => {
                setOpenState(false);
            }}
        >
            <ModalDialog>
                <DialogTitle>دخل تصفیه</DialogTitle>
                <DialogContent
                    sx={{
                        width: "700px",
                        minHeight: "50dvh",
                        maxHeight: "50dvh",
                    }}
                >
                    <Card sx={{ height: "100dvh" }}>
                        <CardContent>
                            <Grid
                                container
                                spacing={2}
                                sx={{ alignItems: "flex-end" }}
                            >
                                <Grid md={4}>
                                    <FormControl>
                                        <FormLabel>د خلاصولو نیټه</FormLabel>
                                        <Input
                                            value={useFormData.opened_date}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={4}>
                                    <FormControl>
                                        <FormLabel>د بندولو نیټه</FormLabel>
                                        <Input
                                            value={useFormData.closed_date}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid md={12} height={"30dvh"}>
                                    <Table
                                        borderAxis="xBetween"
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
                                                <th>#</th>
                                                <th>اولنی موجودي</th>
                                                <th>نغد رسیدګي</th>
                                                <th>نغد بردګي</th>
                                                <th>تصفیه موجودي</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {useCurrencies.map(
                                                (c: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "en",
                                                            ).format(
                                                                c.old_balance,
                                                            )}{" "}
                                                            {c.symbol}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "en",
                                                            ).format(
                                                                c.credit_amount,
                                                            )}{" "}
                                                            {c.symbol}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "en",
                                                            ).format(
                                                                c.debit_amount,
                                                            )}{" "}
                                                            {c.symbol}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat(
                                                                "en",
                                                            ).format(
                                                                c.current_balance,
                                                            )}{" "}
                                                            {c.symbol}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <Textarea
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        remarks: e.target.value,
                                    }))
                                }
                                placeholder="تفصیل"
                                sx={{ width: "100% " }}
                            ></Textarea>
                            <Button
                                fullWidth
                                onClick={() => onSubmit()}
                                loading={useFormData.loading}
                            >
                                {openState.is_open == 0 ? "خلاصول" : "بندول"}
                            </Button>
                        </CardActions>
                    </Card>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}

export default TillOpenCloseView;
