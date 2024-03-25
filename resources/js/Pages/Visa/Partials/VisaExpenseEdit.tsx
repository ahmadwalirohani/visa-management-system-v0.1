import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { Option, Select } from "@mui/joy";

interface IProps {
    openState: boolean;
    setOpenState(state: boolean, is_updated: boolean, payload: any): void;
    id: number;
    currencies: Array<object>;
    name: string | null;
    amount: number;
    currency: number;
}

export default function VisaExpenseEdit({
    openState,
    setOpenState,
    id,
    currencies,
    name,
    currency,
    amount,
}: IProps) {
    const [useData, setData] = React.useState({
        name: "",
        currency: 0,
        amount: 0,
        id: 0,
        loading: false,
    });

    const onChange = (newValue: any, field: string) => {
        setData((prevState) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    React.useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            id: id,
            currency: currency,
            amount: amount,
            name: name as string,
        }));
    }, [id]);
    false;
    return (
        <React.Fragment>
            <Modal
                open={openState}
                onClose={() => setOpenState(false, false, null)}
            >
                <ModalDialog>
                    <DialogTitle> مصرف تغیر</DialogTitle>

                    <form
                        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            setOpenState(false, true, {
                                name: useData.name,
                                amount: useData.amount,
                                currency_id: useData.currency,
                            });
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>مصرف نوم</FormLabel>
                                <Input
                                    value={useData.name}
                                    autoFocus
                                    required
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange(e.target.value, "name")}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>مصرف اسعار</FormLabel>
                                <Select
                                    value={useData.currency}
                                    onChange={(e: any, newValue: any) =>
                                        onChange(newValue, "currency")
                                    }
                                    required
                                >
                                    {currencies.map(
                                        (currency: any, index: number) => (
                                            <Option
                                                value={currency.id}
                                                key={index}
                                            >
                                                {currency.name}
                                            </Option>
                                        ),
                                    )}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>مصرف مبلغ</FormLabel>
                                <Input
                                    required
                                    value={useData.amount}
                                    type="number"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange(e.target.value, "amount")}
                                />
                            </FormControl>
                            <Button loading={useData.loading} type="submit">
                                ثبت
                            </Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
