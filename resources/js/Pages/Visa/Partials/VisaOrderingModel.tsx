import axiosInstance from "@/Pages/Plugins/axiosIns";
import { LoadCurrencies } from "@/Utils/FetchResources";
import { SendActionRequest } from "@/Utils/helpers";
import {
    Button,
    DialogContent,
    DialogTitle,
    Input,
    Modal,
    ModalDialog,
    Stack,
} from "@mui/joy";
import { Table } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

interface IProps {
    openState: boolean;
    setOpenState(state: boolean, is_updated: boolean): void;
    id: number;
}

interface IExpense {
    id: number;
    name: string;
    expense_type: string | null;
    expense_amount: number;
}

function VisaOrderingModel({ openState, setOpenState, id }: IProps) {
    const [useData, setData] = useState({
        visa_id: 0,
        loading: false,
    });
    const [useCurrencies, setCurrencies] = useState<IExpense[]>([]);

    const onSubmit = () => {
        setData((prevState) => ({
            ...prevState,
            loading: true,
        }));

        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "order_visa_status",
                _validation_class: null,
            },
            Object.assign({}, useData, { expenses: useCurrencies }),
        );

        axiosInstance
            .post(Config.url, Config.payload)
            .then(() => {
                setOpenState(false, true);
            })
            .finally(() =>
                setData((prevState) => ({
                    ...prevState,
                    loading: false,
                })),
            );
    };

    const LoadResources = () => {
        LoadCurrencies((currencies: Array<object>): void => {
            setCurrencies(
                currencies.map(
                    (currency: any) =>
                        ({
                            id: currency.id,
                            name: currency.name,
                            expense_type: "",
                            expense_amount: 0,
                        }) as IExpense,
                ),
            );
        });
    };

    const handleInputChange = (
        newValue: any,
        index: number,
        field: string,
    ): void => {
        const expense = [...useCurrencies];
        expense[index] = {
            ...expense[index],
            [field]: newValue,
        };

        setCurrencies(expense);
    };

    useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            visa_id: id,
        }));

        if (useCurrencies.length == 0) LoadResources();
    }, [id]);
    return (
        <>
            <Modal
                open={openState}
                onClose={() => {
                    setOpenState(false, false);
                }}
            >
                <ModalDialog>
                    <DialogTitle> دستور شد</DialogTitle>
                    <DialogContent
                        sx={{
                            width: "500px",
                        }}
                    >
                        <Stack spacing={2}>
                            <Table
                                sx={{
                                    "& tr > *": {
                                        textAlign: "center",
                                        pt: 1,
                                        pb: 1,
                                    },
                                    tableLayout: "fixed",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: 50 }}>#</th>
                                        <th>مصرف</th>
                                        <th>اسعار</th>
                                        <th>مبلغ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {useCurrencies.map(
                                        (currency: IExpense, index: number) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <Input
                                                        size="sm"
                                                        placeholder="مصرف نوم"
                                                        sx={{
                                                            width: 150,
                                                        }}
                                                        value={
                                                            useCurrencies[index]
                                                                .expense_type as string
                                                        }
                                                        onChange={(
                                                            e: ChangeEvent<HTMLInputElement>,
                                                        ) =>
                                                            handleInputChange(
                                                                e.target
                                                                    .value as string,
                                                                index,
                                                                "expense_type",
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>{currency.name}</td>
                                                <td>
                                                    <Input
                                                        size="sm"
                                                        placeholder="00.00"
                                                        type="number"
                                                        value={
                                                            useCurrencies[index]
                                                                .expense_amount
                                                        }
                                                        onChange={(
                                                            e: ChangeEvent<HTMLInputElement>,
                                                        ) =>
                                                            handleInputChange(
                                                                e.target
                                                                    .value as string,
                                                                index,
                                                                "expense_amount",
                                                            )
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </Table>
                            <Button
                                loading={useData.loading}
                                onClick={() => onSubmit()}
                            >
                                ثبت
                            </Button>
                        </Stack>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default VisaOrderingModel;
