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
    IconButton,
    Sheet,
    Snackbar,
    Typography,
} from "@mui/joy";
import { IPagination, IVisaProps } from "@/types";
import axios from "axios";
import TablePagination from "@/Components/TablePagination";
import { getProceedVisaReport } from "@/Utils/FetchReports";
import ProceedVisaReportFilter from "../Components/ProceedVisaReportFilter";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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

interface Data extends IVisaProps {
    visa_no: number;
    id: number;
    created_at: string;
    expense_amount: number;
    discount_amount: number;
    paid_amount: number;
    branch: {
        id: number;
        name: number;
    };
    type: {
        id: number;
        name: number;
    };
    entrance_type: {
        id: number;
        name: number;
    };
    history: Array<any>;
}

const LocaleTransactionTypes = {
    "VISA-CHARGES": "ویزي مصارف",
    "VISA-DISCOUNT": "ویزي تخفیف",
    "VISA-ADVANCE-PAYMENT": "ویزي پیشکي رسید",
    "DEBIT-TO-TILL": "ویزي رسید دخل ته",
    "DEBIT-TO-CREDIT": "ویزي رسید صرافي ته",
};

function ViewProceedVisaReport() {
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
        type: "all",
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
            getProceedVisaReport(useFilterOptions, (response: any) =>
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
        getProceedVisaReport(
            useFilterOptions,
            function (visas: any) {
                Printer("/print/general-format", {
                    title: `   ${useFilterOptions.type == "paid" ? "تصفیه سوي جاري " : useFilterOptions.type == "remaining" ? "ناتصفیه سوي جاري" : "ټولي جاري "} ویزو راپور`,
                    info: `<div>
                                <li>
                                    <span class="i-title">از تاریخ</span> :-
                                    <span class="i-value"> ${moment(useFilterOptions.start_date.replaceAll("/", "-"), "YYYY-M-D").format("jYYYY/jM/jD")} </span>
                                </li>
                                <li>
                                    <span class="i-title">تا تاریخ</span> :-
                                    <span class="i-value"> ${moment(useFilterOptions.end_date.replaceAll("/", "-"), "YYYY-M-D").format("jYYYY/jM/jD")} </span>
                                </li>
                            </div>
                            <div>
                                <li>
                                    <span class="i-title">مشتري</span> :-
                                    <span class="i-value"> ${(useFilterOptions.customer as any)?.name} </span>
                                </li>
                                <li>
                                    <span class="i-title">جمله ویزي</span> :-
                                    <span class="i-value"> ${useReports.length} </span>
                                </li>
                            </div>
                            <div>
                                <li>
                                    <span class="i-title">جمله مبلغ</span> :-
                                    <span class="i-value"> ${useReports.reduce((p, c) => p + Number(c.price), 0)} </span>
                                </li>
                                <li>
                                    <span class="i-title">باقي مبلغ</span> :-
                                    <span class="i-value"> ${useReports.reduce((p, c) => p + Number(c.price - c.paid_amount), 0)} </span>
                                </li>
                            </div>`,
                    Header: function () {
                        return "<tr><th> # </th><th> تاریخ </th><th>شرکت / مشتري</th><th>نام و تخلص</th><th>پاسپورټ</th><th>پلیټ نمبر</th><th>قیمت</th><th>تخفیف</th><th>ویزه نوع</th><th>نوع دخول</th><th>څانګه</th><th>ولایت</th><th>وظیفه</th><th>تفصیل</th></tr>";
                    },
                    Data: function () {
                        let _Rows = "";
                        (visas.data as Data[]).forEach((visa: Data) => {
                            _Rows += "<tr>";
                            _Rows += `<td>${visa.visa_no}</td>`;
                            _Rows += `<td>${visa.created_at}</td>`;
                            _Rows += `<td>${visa.customer.name}</td>`;
                            _Rows += `<td>${visa.name}</td>`;
                            _Rows += `<td>${visa.passport_no}</td>`;
                            _Rows += `<td>${visa.block_no}</td>`;
                            _Rows += `<td>${visa.price} ${(visa.currency as any).symbol}</td>`;
                            _Rows += `<td>${visa.discount_amount} ${(visa.currency as any).symbol}</td>`;
                            _Rows += `<td>${visa.type.name}</td>`;
                            _Rows += `<td>${visa.entrance_type.name}</td>`;
                            _Rows += `<td>${visa.branch.name}</td>`;
                            _Rows += `<td>${visa.province}</td>`;
                            _Rows += `<td>${visa.job}</td>`;
                            _Rows += `<td>${visa.remarks}</td>`;
                            _Rows += "</tr>";
                            _Rows += `<tr class="subTr"><td colspan="14" class="zero-pd"><div class="subBody"><table class="financial-table sub-table"><thead><tr><th style="background-color: transparent;">#</th><th style="background-color: transparent;">تاریخ</th><th style="background-color: transparent;">معاملي ډول</th><th style="background-color: transparent;">رسیدګي</th><th style="background-color: transparent;">بردګي</th><th style="background-color: transparent;">باقي</th></tr></thead><tbody>`;
                            visa.history.forEach(
                                (record: any, index: number) => {
                                    _Rows += "<tr>";
                                    _Rows += `<td>${index + 1}</td>`;
                                    _Rows += `<td>${record.created_at}</td>`;
                                    _Rows += `<td>${LocaleTransactionTypes[record.transactionType as keyof typeof LocaleTransactionTypes]}</td>`;
                                    _Rows += `<td>${new Intl.NumberFormat("en").format(record.credit_amount)} ${record.currency.symbol}</td>`;
                                    _Rows += `<td>${new Intl.NumberFormat("en").format(record.debit_amount)} ${record.currency.symbol}</td>`;
                                    _Rows += `<td>${new Intl.NumberFormat("en").format(visa.price - record.debit_amount)} ${record.currency.symbol}</td>`;
                                    _Rows += "</tr>";
                                },
                            );
                            _Rows += "</tbody></table></div></td></tr>";
                        });
                        return _Rows;
                    },
                }).finally(() => setPrintLoading(false));
            },
            true,
        );
    };

    React.useEffect(() => {
        LoadRows();
    }, [useFilterOptions]);

    function Row(props: { row: Data; initialOpen?: boolean }) {
        const { row } = props;
        const [open, setOpen] = React.useState(props.initialOpen || false);

        return (
            <React.Fragment>
                <tr>
                    <td>
                        <IconButton
                            aria-label="expand row"
                            variant="plain"
                            color="neutral"
                            size="sm"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    </td>
                    <td>{row.visa_no}</td>
                    <td>{row.created_at}</td>
                    <td>{row.customer.name}</td>
                    <td>{row.name}</td>
                    <td>{row.passport_no}</td>
                    <td>{row.block_no}</td>
                    <td>
                        <Chip color="primary">
                            {" "}
                            {row.price} {(row.currency as any).symbol}
                        </Chip>
                    </td>
                    <td>
                        <Chip color="danger">
                            {" "}
                            {row.expense_amount} {(row.currency as any).symbol}
                        </Chip>
                    </td>
                    <td>
                        {row.discount_amount} {(row.currency as any).symbol}
                    </td>
                    <td>{row.type.name}</td>
                    <td>{row.entrance_type.name}</td>
                    <td>{row.branch.name}</td>
                    <td>{row.province}</td>
                    <td>{row.job}</td>
                    <td>{row.remarks}</td>
                </tr>
                <tr>
                    <td style={{ height: 0, padding: 0 }} colSpan={16}>
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
                                    History
                                </Typography>
                                <Table
                                    borderAxis="bothBetween"
                                    size="sm"
                                    aria-label="purchases"
                                    sx={{
                                        "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                                            { textAlign: "right" },
                                        "--TableCell-paddingX": "0.5rem",
                                        tableLayout: "auto",
                                        width: "60%",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>تاریخ</th>
                                            <th>معاملي ډول</th>
                                            <th>رسیدګي</th>
                                            <th>بردګي</th>
                                            <th>باقي</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {row.history?.map(
                                            (historyRow, index: number) => (
                                                <tr key={historyRow.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {historyRow.created_at}
                                                    </td>
                                                    <td>
                                                        {
                                                            LocaleTransactionTypes[
                                                                historyRow.transactionType as keyof typeof LocaleTransactionTypes
                                                            ]
                                                        }
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            historyRow.debit_amount,
                                                        )}{" "}
                                                        {
                                                            historyRow.currency
                                                                .symbol
                                                        }
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            historyRow.credit_amount,
                                                        )}{" "}
                                                        {
                                                            historyRow.currency
                                                                .symbol
                                                        }
                                                    </td>

                                                    <td>
                                                        {new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            row.price -
                                                                historyRow.debit_amount,
                                                        )}{" "}
                                                        {
                                                            (
                                                                row.currency as any
                                                            ).symbol
                                                        }
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

                    <ProceedVisaReportFilter
                        onChange={handleOnChange}
                        useFilter={useFilterOptions}
                        useLoader={useFetchLoader}
                        onSearch={onReportFilter}
                        onPrint={onReportPrint}
                        usePrintLoader={usePrintLoader}
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
                            size="sm"
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
                                        style={{ width: 40 }}
                                        aria-label="empty"
                                    />
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
                                    <th>شرکت / مشتري</th>
                                    <th>نام و تخلص</th>
                                    <th>پاسپورټ</th>
                                    <th>پلیټ نمبر</th>
                                    <th>قیمت</th>
                                    <th>مصارف</th>
                                    <th>تخفیف</th>
                                    <th>ویزه نوع</th>
                                    <th>نوع دخول</th>
                                    <th>څانګه</th>
                                    <th>ولایت</th>
                                    <th>وظیفه</th>
                                    <th>تفصیل</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stableSort(
                                    useReports,
                                    getComparator(order, "id"),
                                ).map((row) => (
                                    <Row
                                        row={row}
                                        key={row.id}
                                        initialOpen={false}
                                    />
                                ))}
                            </tbody>
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

export default ViewProceedVisaReport;
