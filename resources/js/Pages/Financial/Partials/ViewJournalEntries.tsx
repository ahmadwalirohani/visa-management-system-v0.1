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
    Typography,
} from "@mui/joy";
import { IPagination } from "@/types";
import axios from "axios";
import TablePagination from "@/Components/TablePagination";
import JournalReportFilter from "../Components/JournalReportFilter";
import { getJournalEntries } from "@/Utils/FetchReports";
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
    ex_currency: {
        id: number;
        symbol: string;
    };
    currency: {
        id: number;
        symbol: string;
    };
    remarks: string;
    credit_type: string;
    debit_type: string;
}

const PashtoTypes = {
    till: "دخل",
    Bank: "بانک / صرافي",
    Employee: "کارمند",
    Code: "کود",
    Income: "عاید",
    Expense: "عاید",
    Customer: "مشتري",
    Extra: "متفرقه",
    Visa: "ویزه",
};

const TransactionTypes = {
    "CREDIT-FROM-CUSTOMER": "د مشتري څخه رسید",
    "CREDIT-FROM-BANK": "د صرافي / بانک څخه رسید",
    "CREDIT-FROM-EMPLOYEE": "د کارمند څخه رسید",
    "CREDIT-FROM-TILL": "د دخل څخه رسید",
    "CREDIT-FROM-EXTRA": "د متفرقه څخه رسید",
    "CREDIT-FROM-EXPENSE": "د مصرف څخه رسید",
    "CREDIT-FROM-INCOME": "د عاید څخه رسید",
    "VISA-ADVANCE-PAYMENT": "ویزي پیشکي رسید",
    "VISA-EXPENSES": "ویزو مصارف",
    "DEBIT-TO-CUSTOMER": "مشتري ته رسید",
    "DEBIT-TO-EMPLOYEE": "کارمند ته رسید",
    "DEBIT-TO-BANK": "بانک / صرافي ته رسید",
    "DEBIT-TO-TILL": "دخل ته رسید",
    "DEBIT-TO-EXPENSE": "مصرف ته رسید",
    "DEBIT-TO-INCOME": "عاید ته رسید",
    "DEBIT-TO-EXTRA": "متفرقه ته رسید",
    "TILL-OPENING-BALANCE": "دخل شروع بیلانس",
    "BANK-OPENING-BALANCE": "صرافي شروع بیلانس",
};

function ViewJournalEntries() {
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
        transactionType: "",
        search: "",
        start_date: new Date().toLocaleDateString("en-ZA"),
        end_date: new Date().toLocaleDateString("en-ZA"),
        currency: [],
        till: 0,
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
            getJournalEntries(useFilterOptions, (response: any) =>
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
        getJournalEntries(
            useFilterOptions,
            function (entries: Array<any>) {
                Printer("/print/general-format", {
                    title: "روزنامچه راپور",
                    info: ` <div>
                <li>
                    <span class="i-title">چاپ تاریخ</span> :-
                    <span class="i-value"> ${moment().locale("fa").format("YYYY/MM/DD")} </span>
                </li>
                <li>
                    <span class="i-title">روزنامچه</span> :-
                    <span class="i-value"> ${useFilterOptions.till || ""}  </span>
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
                        return `<tr><th>#</th><th>تاریخ</th><th>معاملي ډول</th><th>رسید ډول</th><th>برد ډول</th><th>تفصیل</th><th>تبادله</th><th>رسیدګي</th><th>بردګي</th></tr>`;
                    },
                    Data: function () {
                        let _Rows = "";

                        entries.forEach((entry: Data, index: number) => {
                            _Rows += "<tr>";
                            _Rows += `<td>${index + 1}</td>`;
                            _Rows += `<td>${entry.created_at}</td>`;
                            _Rows += `<td>${TransactionTypes[entry.transactionType as keyof typeof TransactionTypes]}</td>`;
                            _Rows += `<td>${resolveTransactionType(entry, "credit", entry.credit_type)}</td>`;
                            _Rows += `<td>${resolveTransactionType(entry, "debit", entry.debit_type)}</td>`;
                            _Rows += `<td>${entry.remarks ?? ""}</td>`;
                            _Rows += `<td>${entry.ex_currency.symbol}  ${entry.exchange_amount}  (${entry.exchange_rate})</td>`;
                            _Rows += `<td>${new Intl.NumberFormat("en").format(entry.credit_amount)} ${entry.currency.symbol}</td>`;
                            _Rows += `<td>${new Intl.NumberFormat("en").format(entry.debit_amount)} ${entry.currency.symbol}</td>`;
                            _Rows += "</tr>";
                        });

                        return _Rows;
                    },
                }).then(() => setPrintLoading(false));
            },
            false,
        );
    };

    React.useEffect(() => {
        LoadRows();
    }, []);

    const resolveTransactionType = (
        statement: any,
        type: string,
        tType: any,
    ): string => {
        const account =
            statement[
                statement[type + "_type"] == "Expense" ||
                statement[type + "_type"] == "Income"
                    ? "code"
                    : (statement[type + "_type"] as string).toLowerCase()
            ];
        return account
            ? statement[type + "_type"] == "visa"
                ? account.visa_no
                : account?.name
            : PashtoTypes[tType as keyof typeof PashtoTypes];
    };

    return (
        <Grid md={8}>
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

                    <JournalReportFilter
                        onChange={handleOnChange}
                        useFilter={useFilterOptions}
                        useLoader={useFetchLoader}
                        onSearch={onReportFilter}
                        onPrint={onReportPrint}
                        usePrintLoader={usePrintLoader}
                    />

                    <Sheet
                        sx={{
                            height: "50dvh",
                            overflow: "auto",
                            width: "100%",
                            mt: 1,
                        }}
                    >
                        <Table
                            aria-labelledby="tableTitle"
                            stickyHeader
                            stickyFooter
                            hoverRow
                            size="sm"
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
                                    <th style={{}}>
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
                                    <th style={{}}>معاملي ډول</th>

                                    <th style={{}}>رسید ډول</th>
                                    <th style={{}}>برد ډول</th>

                                    <th style={{}}>تفصیل</th>
                                    <th style={{}}>تبادله</th>
                                    <th style={{}}>رسیدګي مبلغ</th>
                                    <th style={{}}>بردګي مبلغ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stableSort(
                                    useReports,
                                    getComparator(order, "id"),
                                ).map((row, index: number) => (
                                    <tr key={row.id}>
                                        {/* <td>
                                             <RowMenu statement={row as Data} />

                                        </td> */}
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
                                        <td>
                                            {resolveTransactionType(
                                                row,
                                                "credit",
                                                row.credit_type,
                                            )}
                                            <Typography
                                                level="body-xs"
                                                color="success"
                                            >
                                                {
                                                    PashtoTypes[
                                                        row.credit_type as keyof typeof PashtoTypes
                                                    ]
                                                }
                                            </Typography>
                                        </td>
                                        <td>
                                            {resolveTransactionType(
                                                row,
                                                "debit",
                                                row.debit_type,
                                            )}
                                            <Typography
                                                level="body-xs"
                                                color="danger"
                                            >
                                                {
                                                    PashtoTypes[
                                                        row.debit_type as keyof typeof PashtoTypes
                                                    ]
                                                }
                                            </Typography>
                                        </td>
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
                                            {row.credit_amount != 0 && (
                                                <Chip color="success">
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
                                            {row.debit_amount != 0 && (
                                                <Chip color="danger">
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(
                                                        row.debit_amount,
                                                    )}{" "}
                                                    {row.currency.symbol}
                                                </Chip>
                                            )}
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

export default ViewJournalEntries;
