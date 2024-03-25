import { IconButton, Input, Sheet, Table, Typography } from "@mui/joy";
import React, { ChangeEvent, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Delete from "@mui/icons-material/Delete";

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
    residence: string;
    serial_no: string;
    profit: number;
    currency: {
        id: number;
        name: string;
        symbol: string;
    };
    expense: number;
    expenses: IExpenseType[];
}

function Row(props: {
    visa: IVisa;
    onChange(newValue: any, field: string, index: number): void;
    index: number;
    initialOpen?: boolean;
    openDeleteDialog(state: boolean, is_updated: boolean, payload: any): void;
    openEditDialog(state: boolean, is_updated: boolean, payload: any): void;
    visaList: IVisa[];
    defaultCurrency: any;
}) {
    const { visa, index } = props;
    const [open, setOpen] = useState(props.initialOpen || false);

    return (
        <React.Fragment>
            <tr>
                <td>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        sx={{ minHeight: "fit-content" }}
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </td>
                <td>{index + 1}</td>
                <td>{visa.visa_no}</td>
                <td>
                    <Input
                        sx={{ width: "110px" }}
                        size="sm"
                        type="number"
                        value={props.visaList[index].price}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.onChange(e.target.value, "price", index)
                        }
                        endDecorator={visa.currency.symbol}
                    />
                </td>
                <td>
                    <Input
                        sx={{ width: "110px" }}
                        size="sm"
                        type="text"
                        value={props.visaList[index].residence}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.onChange(e.target.value, "residence", index)
                        }
                    />
                </td>
                <td>
                    <Input
                        sx={{ width: "110px" }}
                        size="sm"
                        type="text"
                        value={props.visaList[index].serial_no}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.onChange(e.target.value, "serial_no", index)
                        }
                    />
                </td>
                <td>
                    <Input
                        sx={{ width: "110px" }}
                        size="sm"
                        type="number"
                        value={props.visaList[index].expense}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            props.onChange(e.target.value, "expense", index)
                        }
                    />
                </td>
                <td>
                    {new Intl.NumberFormat("en").format(
                        props.visaList[index].profit -
                            props.visaList[index].expense,
                    )}{" "}
                    {props.defaultCurrency?.symbol || ""}
                </td>
            </tr>
            <tr>
                <td style={{ height: 0, padding: 0 }} colSpan={8}>
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
                                مصارف
                            </Typography>
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="purchases"
                                sx={{
                                    "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                                        { textAlign: "right" },
                                    "--TableCell-paddingX": "0.5rem",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>مصرف نوم</th>
                                        <th>اسعار</th>
                                        <th>مبلغ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visa.expenses?.map(
                                        (expense, i: number) => (
                                            <tr key={expense.id}>
                                                <th scope="row">
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                props.openDeleteDialog(
                                                                    true,
                                                                    false,
                                                                    {
                                                                        id: expense.id,
                                                                    },
                                                                )
                                                            }
                                                            size="sm"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                        <div>{i + 1}</div>
                                                    </div>
                                                </th>
                                                <td
                                                    onClick={() =>
                                                        props.openEditDialog(
                                                            true,
                                                            false,
                                                            {
                                                                id: expense.id,
                                                                currency:
                                                                    expense.currency_id,
                                                                name: expense.name as string,
                                                                amount: expense.amount as number,
                                                            },
                                                        )
                                                    }
                                                >
                                                    {expense.name}
                                                </td>
                                                <td>{expense.currency.name}</td>
                                                <td>
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(
                                                        expense.amount,
                                                    )}{" "}
                                                    {expense.currency.symbol}
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

export default Row;
