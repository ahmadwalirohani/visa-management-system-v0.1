import * as React from "react";
import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import LinearProgress from "@mui/joy/LinearProgress";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
    Card,
    CardContent,
    Chip,
    ColorPaletteProp,
    Grid,
    Sheet,
    Snackbar,
} from "@mui/joy";
import { getLoansReport } from "@/Utils/FetchReports";
import LoansReportFilter from "../Components/LoansReportFilter";
import { LoadCurrencies } from "@/Utils/FetchResources";

type Order = "asc" | "desc";

interface Data {
    type: string;
    id: number;
    name: string;
    code: string;
    balancies: Array<{
        id: number;
        balance: number;
        currency_id: number;
        currency: {
            name: string;
        };
    }>;
}

function ViewLoansReport() {
    const [useReports, setRows] = React.useState<Data[]>([]);
    const [order, setOrder] = React.useState<Order>("desc");
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);
    const [usePrintLoader, setPrintLoading] = React.useState<boolean>(false);
    const [useCurrencies, setCurrencies] = React.useState<Array<object>>([]);

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const [useFilterOptions, setFilterOptions] = React.useState({
        branch: null,
        search: "",
        type: "on_loans",
        currency: [],
    });

    const LoadRows = () => {
        setFetchLoading(true);
        getLoansReport(useFilterOptions, (response: any) => {
            setRows(response as Data[]);
            setFetchLoading(false);
        });
    };

    const handleOnChange = (newValue: any, field: string): void => {
        setFilterOptions((prevState) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const onReportFilter = () => {
        LoadRows();
    };

    const onReportPrint = (): void => {
        setPrintLoading(true);
    };

    React.useEffect(() => {
        LoadRows();
    }, [useFilterOptions]);

    React.useEffect(() => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies);
        });
    }, []);

    return (
        <Grid md={12}>
            <Card
                sx={{
                    m: 0,
                    height: { md: "90dvh", sm: "fit-content" },
                }}
            >
                <CardContent>
                    <div style={{ height: 2 }}>
                        {useFetchLoader == true && <LinearProgress size="sm" />}
                    </div>

                    <LoansReportFilter
                        onChange={handleOnChange}
                        useFilter={useFilterOptions}
                        useLoader={useFetchLoader}
                        onSearch={onReportFilter}
                        onPrint={onReportPrint}
                        usePrintLoader={usePrintLoader}
                        useCurrencies={useCurrencies}
                    />
                    <Sheet
                        sx={{
                            height: "70dvh",
                            overflow: "auto",
                            width: "100%",
                        }}
                    >
                        <Table
                            aria-labelledby="tableTitle"
                            stickyHeader
                            stickyFooter
                            hoverRow
                            stripe={"even"}
                            sx={{
                                "--TableCell-headBackground":
                                    "var(--joy-palette-background-level1)",
                                "--Table-headerUnderlineThickness": "1px",
                                "--TableRow-hoverBackground":
                                    "var(--joy-palette-background-level1)",
                                "--TableCell-paddingY": "4px",
                                "--TableCell-paddingX": "8px",
                                "& tr > th": {
                                    textAlign: "right",
                                },
                                tableLayout: "auto",
                            }}
                        >
                            <thead id="mainHeader">
                                <tr>
                                    <th
                                        style={{
                                            width: 48,
                                            textAlign: "center",
                                        }}
                                    >
                                        #
                                    </th>
                                    <th>
                                        <Link
                                            underline="none"
                                            color="primary"
                                            component="button"
                                            onClick={() =>
                                                setOrder(
                                                    order === "asc"
                                                        ? "desc"
                                                        : "asc",
                                                )
                                            }
                                            fontWeight="lg"
                                            endDecorator={<ArrowDropDownIcon />}
                                            sx={{
                                                "& svg": {
                                                    transition: "0.2s",
                                                    transform:
                                                        order === "desc"
                                                            ? "rotate(0deg)"
                                                            : "rotate(180deg)",
                                                },
                                            }}
                                        >
                                            اکاونټ ډول
                                        </Link>
                                    </th>
                                    <th> اکاونټ نوم</th>
                                    <th> مبلغ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {useReports
                                    .filter(
                                        (account) =>
                                            account.balancies.length > 0,
                                    )
                                    .map((row, index: number) => (
                                        <tr key={row.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Chip>{row.type}</Chip>
                                            </td>
                                            <td>
                                                {" "}
                                                {row.name} {row.code}{" "}
                                            </td>
                                            <td>
                                                {row.balancies.map(
                                                    (balance) => (
                                                        <span key={balance.id}>
                                                            <Chip
                                                                color={
                                                                    useFilterOptions.type ==
                                                                    "on_loans"
                                                                        ? "danger"
                                                                        : "success"
                                                                }
                                                            >
                                                                {new Intl.NumberFormat(
                                                                    "en",
                                                                ).format(
                                                                    balance.balance,
                                                                )}{" "}
                                                                {
                                                                    balance
                                                                        .currency
                                                                        .name
                                                                }
                                                            </Chip>{" "}
                                                            &nbsp;&nbsp;&nbsp;
                                                        </span>
                                                    ),
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}></td>
                                    <td>
                                        {useCurrencies
                                            .filter((c: any) =>
                                                useFilterOptions.currency.some(
                                                    (sc) => sc == c.id,
                                                ),
                                            )
                                            .map((c: any) => (
                                                <span key={c.id}>
                                                    <Chip color="primary">
                                                        {c.name} : &nbsp;&nbsp;
                                                        {new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            useReports.reduce(
                                                                (p, account) =>
                                                                    p +
                                                                    Number(
                                                                        account.balancies.reduce(
                                                                            (
                                                                                pb,
                                                                                balance,
                                                                            ) =>
                                                                                pb +
                                                                                Number(
                                                                                    balance.currency_id ==
                                                                                        c.id
                                                                                        ? balance.balance
                                                                                        : 0,
                                                                                ),
                                                                            0,
                                                                        ),
                                                                    ),
                                                                0,
                                                            ),
                                                        )}
                                                    </Chip>
                                                    &nbsp;&nbsp;&nbsp;
                                                </span>
                                            ))}
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Sheet>

                    <Snackbar
                        variant="solid"
                        color={useSnackbar.state as ColorPaletteProp}
                        autoHideDuration={3000}
                        open={useSnackbar.is_open}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                        }}
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
                </CardContent>
            </Card>
        </Grid>
    );
}

export default ViewLoansReport;
