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
import { IPagination } from "@/types";
import axios from "axios";
import TablePagination from "@/Components/TablePagination";
import CustomerLedgerFilter from "../Components/CustomerLedgerFilter";
import { getCustomerLedger } from "@/Utils/FetchReports";
import Printer from "@/Utils/Printer";
import moment from "jalali-moment";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
) => number {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface Data {
    created_at: string;
    id: number;
    transactionType: string;
    credit_amount: number;
    debit_amount: number;
    exchange_amount: number;
    exchange_rate: number;
    balance: number;
    ex_currency: {
        id: number;
        symbol: string;
    };
    currency: {
        id: number;
        symbol: string;
    };
    remarks: string;
    visa: any;
    debit_type: string;
}

const TransactionTypes = {
    "CREDIT-FROM-CUSTOMER": "د مشتري څخه رسید",
    "CREDIT-FROM-BANK": "د صرافي / بانک څخه رسید",
    "CREDIT-FROM-EMPLOYEE": "د کارمند څخه رسید",
    "CREDIT-FROM-TILL": "د دخل څخه رسید",
    "CREDIT-FROM-EXTRA": "د متفرقه څخه رسید",
    "CREDIT-FROM-EXPENSE": "د مصرف څخه رسید",
    "CREDIT-FROM-INCOME": "د عاید څخه رسید",
    "VISA-ADVANCE-PAYMENT": "ویزي پیشکي رسید",
    "VISA-CHARGES": "ویزي مصارف",
    "DEBIT-TO-CUSTOMER": "مشتري ته رسید",
    "DEBIT-TO-EMPLOYEE": "کارمند ته رسید",
    "DEBIT-TO-BANK": "بانک / صرافي ته رسید",
    "DEBIT-TO-TILL": "دخل ته رسید",
    "DEBIT-TO-EXPENSE": "مصرف ته رسید",
    "DEBIT-TO-INCOME": "عاید ته رسید",
    "DEBIT-TO-EXTRA": "متفرقه ته رسید",
    "OPENING-BALANCE": " شروع بیلانس",
};

function ViewCustomerLedger() {
    const [useReports, setRows] = React.useState<Data[]>([]);
    const [order, setOrder] = React.useState<Order>("desc");
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);
    const [usePrintLoader, setPrintLoading] = React.useState<boolean>(false);
    const [usePagination, setPagination] = React.useState<IPagination>({
        first_page_url: "",
        last_page_url: "",
        prev_page_url: "",
        next_page_url: "",
        path: "",
        per_page: 0,
        links: [],
        last_page: 0,
        current_page: 0,
        from: 0,
        to: 0,
        total: 0,
    });
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const [useFilterOptions, setFilterOptions] = React.useState({
        customer: null,
        search: "",
        start_date: new Date().toLocaleDateString("en-ZA"),
        end_date: new Date().toLocaleDateString("en-ZA"),
        currency: [],
    });

    const LoadRows = (url: string | null | boolean = false) => {
        setFetchLoading(true);
        const callback = (response: any): void => {
            setRows(response.data as Data[]);
            setPagination({
                first_page_url: response.first_page_url,
                last_page_url: response.last_page_url,
                prev_page_url: response.prev_page_url,
                next_page_url: response.next_page_url,
                path: response.path,
                per_page: response.per_page,
                links: response.links,
                last_page: response.last_page,
                current_page: response.current_page,
                from: response.from,
                to: response.to,
                total: response.total,
            });
            setFetchLoading(false);
        };
        if (url)
            axios.get(url as string).then((Response: any) => {
                callback(Response.data);
            });
        else
            getCustomerLedger(useFilterOptions, (response: any) =>
                callback(response),
            );
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
        getCustomerLedger(
            useFilterOptions,
            function (statements: Array<any>) {
                Printer("/print/general-format", {
                    title: " مشتري صورت حساب",
                    info: ` <div>
                <li>
                    <span class="i-title">چاپ تاریخ</span> :-
                    <span class="i-value"> ${moment().locale("fa").format("YYYY/MM/DD")} </span>
                </li>
                <li>
                    <span class="i-title">مشتري</span> :-
                    <span class="i-value"> ${(useFilterOptions.customer as any)?.name || ""}  </span>
                </li>
            </div>
            <div>
                <li>
                    <span class="i-title">از تاریخ</span> :-
                    <span class="i-value"> ${moment(useFilterOptions.start_date.replaceAll("/", "-"), "YYYY-M-D").format("jYYYY/jM/jD")} </span>
                </li>
                <li>
                    <span class="i-title">تا تاریخ</span> :-
                    <span class="i-value"> ${moment(useFilterOptions.end_date.replaceAll("/", "-"), "YYYY-M-D").format("jYYYY/jM/jD")}  </span>
                </li>
            </div>
             <div>
                <li>
                    <span class="i-title">جمله رسیدګي</span> :-
                    <span class="i-value"> ${new Intl.NumberFormat("en").format(
                        useReports.reduce(
                            (p, c) => p + Number(c.credit_amount),
                            0,
                        ),
                    )} </span>
                </li>
                <li>
                    <span class="i-title">جمله بردګي</span> :-
                    <span class="i-value"> ${new Intl.NumberFormat("en").format(
                        useReports.reduce(
                            (p, c) => p + Number(c.debit_amount),
                            0,
                        ),
                    )}  </span>
                </li>
            </div>
            `,
                    Header: function () {
                        return `<tr><th>#</th><th>تاریخ</th><th>معاملي ډول</th><th>ویزه </th><th>تفصیل</th><th>تبادله</th><th>رسیدګي</th><th>بردګي</th><th>بیلانس</th></tr>`;
                    },
                    Data: function () {
                        let _Rows = "";

                        (statements as any).ledger.forEach(
                            (entry: Data, index: number) => {
                                _Rows += "<tr>";
                                _Rows += `<td>${index + 1}</td>`;
                                _Rows += `<td>${entry.created_at}</td>`;
                                _Rows += `<td>${TransactionTypes[entry.transactionType as keyof typeof TransactionTypes]}</td>`;
                                _Rows += `<td>${entry.visa?.visa_no ?? ""}</td>`;
                                _Rows += `<td>${entry.remarks ?? ""}</td>`;
                                _Rows += `<td>${entry.ex_currency.symbol}  ${entry.exchange_amount}  (${entry.exchange_rate})</td>`;
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.credit_amount)} ${entry.currency.symbol}</td>`;
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.debit_amount)} ${entry.currency.symbol}</td>`;
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.balance)} ${entry.currency.symbol}</td>`;
                                _Rows += "</tr>";
                            },
                        );

                        return _Rows;
                    },
                }).then(() => setPrintLoading(false));
            },
            false,
        );
    };

    const onCustomReportPrint = (): void => {
        setPrintLoading(true);
        getCustomerLedger(
            useFilterOptions,
            function (_response: Array<any>) {
                const response = _response as any;
                Printer("/print/customer-ledger-format", {
                    body: function () {
                        let _Rows = "";

                        response.ledger.forEach(
                            (entry: Data, index: number) => {
                                _Rows += `<tr style="${entry.visa != null ? "" : "background-color: white !important;"}">`;
                                _Rows += `<td>${index + 1}</td>`;
                                _Rows += `<td>${entry.created_at.substring(0, 10)}</td>`;
                                if (entry.visa == null)
                                    _Rows += `<td colspan="9">${entry.remarks ?? ""}</td>`;
                                else {
                                    _Rows += `<td>${entry.visa?.name}</td>`;
                                    _Rows += `<td>${entry.visa?.province}</td>`;
                                    _Rows += `<td>${entry.visa?.remarks ?? ""}</td>`;
                                    _Rows += `<td>${entry.visa?.passport_no}</td>`;
                                    _Rows += `<td>${entry.visa?.block_no ?? ""}</td>`;
                                    _Rows += `<td>${entry.visa?.type.name}</td>`;
                                    _Rows += `<td>${entry.visa?.entrance_type.name}</td>`;
                                    _Rows += `<td>${entry.visa?.proceed_visa?.serial_no}</td>`;
                                    _Rows += `<td>${entry.visa?.proceed_visa?.residence}</td>`;
                                }
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.credit_amount)} ${entry.currency.symbol}</td>`;
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.debit_amount)} ${entry.currency.symbol}</td>`;
                                _Rows += `<td>${new Intl.NumberFormat("en").format(entry.balance)} ${entry.currency.symbol}</td>`;
                                _Rows += "</tr>";
                            },
                        );

                        return _Rows;
                    },
                    fromDate: moment(
                        useFilterOptions.start_date.replaceAll("/", "-"),
                        "YYYY-M-D",
                    ).format("jYYYY/jM/jD"),
                    toDate: moment(
                        useFilterOptions.end_date.replaceAll("/", "-"),
                        "YYYY-M-D",
                    ).format("jYYYY/jM/jD"),
                    totalAmount: response.balance?.balance,
                    reminder: response.balance?.balance,
                    totalCredit: response.ledger.reduce(
                        (p: number, c: any) => p + Number(c.credit_amount),
                        0,
                    ),
                    totalDebit: response.ledger.reduce(
                        (p: number, c: any) => p + Number(c.debit_amount),
                        0,
                    ),
                    visaCount: response.visa_totals[0].total_visa,
                    visaAmount: response.visa_totals[0].total_amount,
                }).then(() => setPrintLoading(false));
            },
            false,
        );
    };
    React.useEffect(() => {
        LoadRows();
    }, [useFilterOptions]);

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

                    <CustomerLedgerFilter
                        onChange={handleOnChange}
                        useFilter={useFilterOptions}
                        useLoader={useFetchLoader}
                        onSearch={onReportFilter}
                        onPrint={onReportPrint}
                        usePrintLoader={usePrintLoader}
                        onCustomPrint={onCustomReportPrint}
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
                                            تاریخ
                                        </Link>
                                    </th>
                                    <th>معاملي ډول</th>

                                    <th>ویزه</th>

                                    <th>تفصیل</th>
                                    <th>تبادله</th>
                                    <th>رسیدګي مبلغ</th>
                                    <th>بردګي مبلغ</th>
                                    <th>بیلانس</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stableSort(
                                    useReports,
                                    getComparator(order, "id"),
                                ).map((row, index: number) => (
                                    <tr key={row.id}>
                                        <td>{index + 1}</td>
                                        <td>{row.created_at}</td>
                                        <td>
                                            <Chip>
                                                {
                                                    TransactionTypes[
                                                        row.transactionType as keyof typeof TransactionTypes
                                                    ]
                                                }
                                            </Chip>
                                        </td>

                                        <td>{row.visa?.visa_no}</td>
                                        <td>{row.remarks}</td>
                                        <td>
                                            {row.ex_currency.symbol}{" "}
                                            {new Intl.NumberFormat("en").format(
                                                row.exchange_amount,
                                            )}{" "}
                                            (
                                            {new Intl.NumberFormat("en").format(
                                                row.exchange_rate,
                                            )}
                                            )
                                        </td>

                                        <td>
                                            {row.debit_amount != 0 && (
                                                <Chip color="success">
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(
                                                        row.debit_amount,
                                                    )}{" "}
                                                    {row.currency.symbol}
                                                </Chip>
                                            )}
                                        </td>
                                        <td>
                                            {row.credit_amount != 0 && (
                                                <Chip color="danger">
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(
                                                        row.credit_amount,
                                                    )}{" "}
                                                    {row.currency.symbol}
                                                </Chip>
                                            )}
                                        </td>
                                        <td>
                                            <Chip color="primary">
                                                {new Intl.NumberFormat(
                                                    "en",
                                                ).format(row.balance)}{" "}
                                                {row.currency.symbol}
                                            </Chip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={7}></td>
                                    <td>
                                        {new Intl.NumberFormat("en").format(
                                            useReports.reduce(
                                                (p, c) =>
                                                    p + Number(c.credit_amount),
                                                0,
                                            ),
                                        )}
                                    </td>
                                    <td>
                                        {new Intl.NumberFormat("en").format(
                                            useReports.reduce(
                                                (p, c) =>
                                                    p + Number(c.debit_amount),
                                                0,
                                            ),
                                        )}
                                    </td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Sheet>
                    <TablePagination
                        usePagination={usePagination}
                        LoadRows={LoadRows}
                    />

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

export default ViewCustomerLedger;
