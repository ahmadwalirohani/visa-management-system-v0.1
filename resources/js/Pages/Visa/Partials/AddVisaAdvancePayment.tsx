import { GetTills } from "@/Utils/FetchResources";
import {
    Card,
    CardContent,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Option,
    Select,
    Table,
    Textarea,
    Typography,
} from "@mui/joy";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";

interface IProps {
    formData: any;
    onChange(newValue: any, field: string, sourceType: boolean): void;
    selectedCurrency: number;
    selectedCustomer: any;
    price: number;
}

interface ITill {
    id: number;
    balancies: Array<object>;
    name: string;
}

function AddVisaAdvancePayment({
    formData,
    onChange,
    selectedCurrency,
    selectedCustomer,
    price,
}: IProps) {
    const [useTills, setTills] = useState<ITill[]>([]);

    const LoadTills = () => {
        GetTills(function (tills: Array<object>): void {
            setTills(tills as ITill[]);
        });
    };

    const oldCustomerBalance = (): number => {
        if (
            selectedCurrency > 0 &&
            selectedCustomer &&
            typeof selectedCustomer == "object"
        ) {
            return selectedCustomer.balancies.filter(
                (c: any) => c.currency_id == selectedCurrency,
            )[0].balance;
        }

        return 0;
    };

    const oldTillBalance = (): number => {
        if (selectedCurrency > 0 && formData.till > 0) {
            return (
                useTills
                    .filter((t: any) => t.id == formData.till)[0]
                    .balancies.filter(
                        (c: any) => c.currency_id == selectedCurrency,
                    )[0] as any
            ).balance;
        }

        return 0;
    };

    useEffect(() => {
        LoadTills();
    }, []);

    return (
        <Grid md={4}>
            <Card
                sx={{
                    height: "85dvh",
                }}
            >
                <CardContent>
                    <Typography level="h4" sx={{ mb: 2 }}>
                        پیشکي رسید
                    </Typography>
                    <Grid container rowSpacing={1}>
                        <Grid md={12}>
                            <FormControl>
                                <FormLabel>دخل / تجري</FormLabel>
                                <Select
                                    value={formData.till}
                                    onChange={(
                                        e: SyntheticEvent | null,
                                        newValue: number | null,
                                    ) =>
                                        onChange(newValue as any, "till", true)
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
                        </Grid>
                        <Grid md={12}>
                            <FormControl>
                                <FormLabel>رسید مبلغ</FormLabel>
                                <Input
                                    type="number"
                                    value={formData.advance_amount}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        onChange(
                                            (e.target as HTMLInputElement)
                                                .value,
                                            "advance_amount",
                                            true,
                                        )
                                    }
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={12}>
                            <FormControl>
                                <FormLabel>تفصیل</FormLabel>
                                <Textarea
                                    value={formData.premarks}
                                    onChange={(
                                        e: ChangeEvent<HTMLTextAreaElement>,
                                    ) =>
                                        onChange(
                                            (e.target as HTMLTextAreaElement)
                                                .value,
                                            "premarks",
                                            true,
                                        )
                                    }
                                    minRows={3}
                                />
                            </FormControl>
                        </Grid>
                        <Grid md={12}>
                            <Table
                                sx={{
                                    "& tr > *": {
                                        textAlign: "right",
                                    },
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th>مشتري زوړ موجودي</th>
                                        <td>
                                            {new Intl.NumberFormat("en").format(
                                                oldCustomerBalance(),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>مشتري نوي موجودي</th>
                                        <td>
                                            {new Intl.NumberFormat("en").format(
                                                oldCustomerBalance() +
                                                    Number(price),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>دخل زوړ موجودي</th>
                                        <td>
                                            {new Intl.NumberFormat("en").format(
                                                oldTillBalance(),
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>دخل نوي موجودي</th>
                                        <td>
                                            {new Intl.NumberFormat("en").format(
                                                oldTillBalance() +
                                                    Number(
                                                        formData.advance_amount,
                                                    ),
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default AddVisaAdvancePayment;
