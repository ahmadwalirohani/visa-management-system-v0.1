import * as React from "react";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import LinearProgress from "@mui/joy/LinearProgress";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Head } from "@inertiajs/react";
import { Button, Card, ColorPaletteProp, Snackbar } from "@mui/joy";
import { IPagination } from "@/types";
import { getPayrolls } from "@/Utils/FetchResources";
import axios from "axios";
import TablePagination from "@/Components/TablePagination";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import AddPayroll from "./Partials/AddPayroll";
import ViewPayrollSheetModal from "./Partials/ViewPayrollSheetModal";

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
    working_days: number;
    start_date: string;
    end_date: string;
    remarks: string | null;
    details: Array<{
        id: number;
        employee: any;
        absence_days: number;
        presence_days: number;
        tax: number;
        overtime: number;
        net_salary: number;
        salary: number;
    }>;
}

export default function EmployeePayroll() {
    const { privileges } = useUserBranchesContext();
    const [useRows, setRows] = React.useState<Data[]>([]);
    const [order, setOrder] = React.useState<Order>("desc");
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);
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

    const [useDialogState, setDialogState] = React.useState({
        state: false,
        viewState: false,
        start_date: "",
        end_date: "",
        working_days: 0,
        details: [],
    });

    const openPayrollAddDialog = (state: any) => {
        setDialogState((prev) => ({
            ...prev,
            state,
        }));
        if (!state) LoadRows();
    };

    const openPayrollViewDialog = (state: boolean) => {
        setDialogState((prev) => ({
            ...prev,
            viewState: state,
        }));
    };

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const [useFilterOptions] = React.useState({
        search: "",
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
            getPayrolls(useFilterOptions, (response: any) =>
                callback(response),
            );
    };

    React.useEffect(() => {
        LoadRows();
    }, [useFilterOptions]);

    return (
        <>
            <Head title=" معاشاتو توزیع" />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: { xs: "calc(12px + var(--Header-height))", md: 5 },
                    pb: { xs: 2, sm: 2, md: 1 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100dvh",
                    gap: 1,
                    overflow: "auto",
                }}
            >
                {privileges.visa.reports.pending && (
                    <Card sx={{ m: 0, width: "100%", height: "88vh" }}>
                        <div style={{ height: 2 }}>
                            {useFetchLoader == true && (
                                <LinearProgress size="sm" />
                            )}
                        </div>
                        <Box
                            className="SearchAndFilters-tabletUp"
                            sx={{
                                borderRadius: "sm",
                                py: 2,
                                display: { xs: "none", sm: "flex" },
                                flexWrap: "wrap",
                                gap: 1.5,
                                "& > *": {
                                    minWidth: { xs: "100px", md: "200px" },
                                },
                            }}
                        >
                            <Button onClick={() => openPayrollAddDialog(true)}>
                                معاشات توزیع کول
                            </Button>
                        </Box>
                        <Sheet
                            className="TableContainer"
                            variant="outlined"
                            sx={{
                                display: { xs: "none", sm: "initial" },
                                width: "100%",
                                borderRadius: "sm",
                                flexShrink: 1,
                                overflow: "auto",
                                minHeight: 0,
                            }}
                        >
                            <Table
                                aria-labelledby="tableTitle"
                                stickyHeader
                                hoverRow
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
                                }}
                            >
                                <thead>
                                    <tr>
                                        {/* <th
                                            style={{
                                                width: 48,
                                                textAlign: "center",
                                                padding: "12px 6px",
                                            }}
                                        ></th> */}
                                        <th
                                            style={{
                                                width: 120,
                                                padding: "12px 6px",
                                            }}
                                        >
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
                                                endDecorator={
                                                    <ArrowDropDownIcon />
                                                }
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
                                                #
                                            </Link>
                                        </th>
                                        <th
                                            style={{
                                                width: 160,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            تاریخ
                                        </th>

                                        <th
                                            style={{
                                                width: 240,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            شروع نیټه
                                        </th>
                                        <th
                                            style={{
                                                width: 140,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            ختم نیټه
                                        </th>

                                        <th
                                            style={{
                                                width: 140,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            کاري ورځي
                                        </th>
                                        <th
                                            style={{
                                                width: 140,
                                                padding: "12px 6px",
                                            }}
                                        >
                                            تفصیل
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stableSort(
                                        useRows,
                                        getComparator(order, "id"),
                                    ).map((row) => (
                                        <tr
                                            onClick={() =>
                                                setDialogState((prev) => ({
                                                    ...prev,
                                                    viewState: true,
                                                    start_date: row.start_date,
                                                    end_date: row.end_date,
                                                    working_days:
                                                        row.working_days,
                                                    details: row.details as any,
                                                }))
                                            }
                                            key={row.id}
                                        >
                                            <td>{row.id}</td>
                                            <td>
                                                {row.created_at.substring(
                                                    0,
                                                    10,
                                                )}
                                            </td>

                                            <td>{row.start_date}</td>
                                            <td>{row.end_date}</td>
                                            <td>{row.working_days}</td>
                                            <td>{row.remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Sheet>
                        <TablePagination
                            usePagination={usePagination}
                            LoadRows={LoadRows}
                        />
                    </Card>
                )}
            </Box>

            <AddPayroll
                setOpenState={openPayrollAddDialog}
                openState={useDialogState}
                showSnackbar={function (
                    is_open: boolean,
                    state: string,
                    msg: string,
                ): void {
                    setSnackbar({
                        msg,
                        is_open,
                        state,
                    });
                }}
            />

            <ViewPayrollSheetModal
                openState={useDialogState}
                setOpenState={openPayrollViewDialog}
                infoProps={{
                    ...useDialogState,
                }}
            />

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={3000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
        </>
    );
}
