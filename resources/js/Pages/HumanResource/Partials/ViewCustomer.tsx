import * as React from "react";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import SearchIcon from "@mui/icons-material/Search";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import PrintIcon from "@mui/icons-material/Print";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { visuallyHidden } from "@mui/utils";
import { GetCustomers } from "@/Utils/FetchResources";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
    Button,
    Chip,
    ColorPaletteProp,
    Divider,
    Dropdown,
    Grid,
    Input,
    LinearProgress,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Snackbar,
} from "@mui/joy";
import ResolveStatus from "@/Components/ResolveStatus";
import { useEventEmitter } from "../Customer";
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChangeResourceStatus from "@/Utils/ChangeResourceStatus";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

interface Data {
    id: number;
    name: string;
    agent_name: string;
    province: string;
    address: string;
    phone: string;
    email: string;
    code: string;
    status: number;
    created_at: string;
    branch: any;
    actions: string;
}

function labelDisplayedRows({
    from,
    to,
    count,
}: {
    from: number;
    to: number;
    count: number;
}) {
    return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

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

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
    width: number;
}

const headCells: readonly HeadCell[] = [
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "",
        width: 50,
    },
    {
        id: "id",
        numeric: false,
        disablePadding: true,
        label: "#",
        width: 50,
    },
    {
        id: "name",
        numeric: true,
        disablePadding: false,
        label: "نوم",
        width: 200,
    },
    {
        id: "agent_name",
        numeric: true,
        disablePadding: false,
        label: "مسؤل نوم",
        width: 150,
    },
    {
        id: "phone",
        numeric: true,
        disablePadding: false,
        label: "تلیفون نمبر",
        width: 120,
    },
    {
        id: "province",
        numeric: true,
        disablePadding: false,
        label: "ولایت",
        width: 120,
    },

    {
        id: "code",
        numeric: true,
        disablePadding: false,
        label: "کود",
        width: 80,
    },
    {
        id: "branch",
        numeric: true,
        disablePadding: false,
        label: "څانګه",
        width: 150,
    },
    {
        id: "status",
        numeric: true,
        disablePadding: false,
        label: "حالت",
        width: 100,
    },
    {
        id: "address",
        numeric: true,
        disablePadding: false,
        label: "ادرس",
        width: 150,
    },
    {
        id: "email",
        numeric: true,
        disablePadding: false,
        label: "ایمیل ادرس",
        width: 200,
    },
    {
        id: "created_at",
        numeric: true,
        disablePadding: false,
        label: "تاریخ ",
        width: 150,
    },
];

interface EnhancedTableProps {
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <thead>
            <tr>
                {headCells.map((headCell) => {
                    const active = orderBy === headCell.id;
                    return (
                        <th
                            key={headCell.id}
                            aria-sort={
                                active
                                    ? (
                                          {
                                              asc: "ascending",
                                              desc: "descending",
                                          } as const
                                      )[order]
                                    : undefined
                            }
                            style={{
                                width: headCell.width,
                            }}
                        >
                            <Link
                                underline="none"
                                color="neutral"
                                textColor={
                                    active ? "primary.plainColor" : undefined
                                }
                                component="button"
                                onClick={createSortHandler(headCell.id)}
                                fontWeight="lg"
                                startDecorator={
                                    headCell.numeric ? (
                                        <ArrowDownwardIcon
                                            sx={{ opacity: active ? 1 : 0 }}
                                        />
                                    ) : null
                                }
                                endDecorator={
                                    !headCell.numeric ? (
                                        <ArrowDownwardIcon
                                            sx={{ opacity: active ? 1 : 0 }}
                                        />
                                    ) : null
                                }
                                sx={{
                                    "& svg": {
                                        transition: "0.2s",
                                        transform:
                                            active && order === "desc"
                                                ? "rotate(0deg)"
                                                : "rotate(180deg)",
                                    },
                                    "&:hover": { "& svg": { opacity: 1 } },
                                }}
                            >
                                {headCell.label}
                                {active ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === "desc"
                                            ? "sorted descending"
                                            : "sorted ascending"}
                                    </Box>
                                ) : null}
                            </Link>
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

function EnhancedTableToolbar() {
    return (
        <Box
            sx={{
                py: 1,
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },

                borderTopLeftRadius: "var(--unstable_actionRadius)",
                borderTopRightRadius: "var(--unstable_actionRadius)",
            }}
        >
            <form style={{ display: "flex", alignItems: "flex-end" }}>
                <FormControl>
                    <FormLabel>پلټنه</FormLabel>
                    <Input size="sm" startDecorator={<SearchIcon />} />
                </FormControl>
                <FormControl
                    sx={{
                        width: 200,
                        mr: 2,
                    }}
                >
                    <FormLabel>څانګه</FormLabel>
                    <Select size="sm">
                        <Option value={1}>څانګه</Option>
                        <Option value={1}>څانګه</Option>
                    </Select>
                </FormControl>
                <FormControl
                    sx={{
                        width: 100,
                        mr: 2,
                    }}
                >
                    <FormLabel>حالت</FormLabel>
                    <Select size="sm">
                        <Option value={1}>فعال</Option>
                        <Option value={0}>غیر فعال</Option>
                    </Select>
                </FormControl>
                <Button type="submit" size="sm" sx={{ mr: 2 }}>
                    <SearchIcon />
                </Button>

                <Button variant="outlined" size="sm" sx={{ mr: 2 }}>
                    <PrintIcon />
                    چاپ
                </Button>
            </form>
        </Box>
    );
}

export default function ViewCustomer() {
    const { privileges } = useUserBranchesContext();
    const [order, setOrder] = React.useState<Order>("asc");
    const [orderBy, setOrderBy] = React.useState<keyof Data>("id");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [rows, setRows] = React.useState<Data[]>([]);
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const LoadCustomers = () => {
        setFetchLoading(true);
        GetCustomers((customers: Array<object>): void => {
            setRows([...(customers as Data[])]);
            setFetchLoading(false);
        });
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any, newValue: number | null) => {
        setRowsPerPage(parseInt(newValue!.toString(), 10));
        setPage(0);
    };

    const getLabelDisplayedRowsTo = () => {
        if (rows.length === -1) {
            return (page + 1) * rowsPerPage;
        }
        return rowsPerPage === -1
            ? rows.length
            : Math.min(rows.length, (page + 1) * rowsPerPage);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const { emitEvent, addEventListener } = useEventEmitter();

    const SendCustomerToForm = (payload: any) => {
        emitEvent("SendPayloadToFormEvent", payload);
    };

    React.useEffect(() => {
        addEventListener(
            "ReloadCustomersEvent",
            function (isFetch = false): void {
                if (isFetch) LoadCustomers();
            },
        );
        if (!rows.length) LoadCustomers();
        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener(
                "ReloadCustomersEvent",
                function (isFetch = false): void {
                    if (isFetch) LoadCustomers();
                },
            );
        };
    }, []);

    const onCustomerStatusChange = (customer: any): void => {
        ChangeResourceStatus({
            id: customer.id,
            model: "Customer",
            status: customer.status as number,
            onSend() {},
            afterChange() {
                setSnackbar({
                    msg: `مشتري په بریالي سره ${customer.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadCustomers();
            },
        });
    };

    return (
        <Grid xl={10} md={10} sm={12}>
            <Box
                sx={{
                    px: { xs: 2, md: 0 },
                    overflow: "auto",
                }}
            >
                <Typography level="h3" component="h1" sx={{ mt: 0, mb: 0 }}>
                    مشتريان
                </Typography>
            </Box>

            <EnhancedTableToolbar />
            <Sheet
                sx={{
                    height: "74dvh",
                    width: "100%",
                    borderRadius: "sm",
                    flexShrink: 1,
                    overflow: "auto",
                    minHeight: 0,
                }}
            >
                <div style={{ height: 2 }}>
                    {useFetchLoader == true && <LinearProgress size="sm" />}
                </div>
                <Table
                    aria-labelledby="tableTitle"
                    hoverRow
                    size="sm"
                    stickyFooter
                    stickyHeader
                    sx={{
                        "--TableCell-selectedBackground": (theme) =>
                            theme.vars.palette.success.softBg,

                        "& tfoot": {
                            position: "relative",
                            bottom: "-40dvh",
                        },
                        "& tr > th,td": { textAlign: "right" },
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px",
                    }}
                >
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <tbody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map((row, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Dropdown>
                                                <MenuButton
                                                    slots={{ root: IconButton }}
                                                    slotProps={{
                                                        root: {
                                                            variant: "plain",
                                                            color: "neutral",
                                                            size: "sm",
                                                        },
                                                    }}
                                                >
                                                    <MoreHorizRoundedIcon />
                                                </MenuButton>
                                                <Menu
                                                    size="sm"
                                                    sx={{ minWidth: 140 }}
                                                >
                                                    <MenuItem
                                                        onClick={() =>
                                                            SendCustomerToForm(
                                                                row,
                                                            )
                                                        }
                                                        disabled={
                                                            privileges.customer
                                                                .actions.edit ==
                                                            false
                                                        }
                                                    >
                                                        <Edit />
                                                        تغیر
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() =>
                                                            onCustomerStatusChange(
                                                                row,
                                                            )
                                                        }
                                                    >
                                                        {row.status == 1 && (
                                                            <VisibilityOff />
                                                        )}
                                                        {row.status == 0 && (
                                                            <Visibility />
                                                        )}

                                                        {row.status
                                                            ? "غیر فعال"
                                                            : "فعال"}
                                                    </MenuItem>

                                                    <Divider />
                                                    <MenuItem
                                                        disabled={
                                                            privileges.customer
                                                                .actions
                                                                .delete == false
                                                        }
                                                        color="danger"
                                                    >
                                                        <DeleteIcon />
                                                        حذف
                                                    </MenuItem>
                                                    <Divider />
                                                    <MenuList>
                                                        <Table
                                                            size="sm"
                                                            sx={{
                                                                width: "200px",
                                                                tableLayout:
                                                                    "auto",
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    <th
                                                                        style={{
                                                                            textAlign:
                                                                                "right",
                                                                        }}
                                                                    >
                                                                        اسعار
                                                                    </th>
                                                                    <th
                                                                        style={{
                                                                            textAlign:
                                                                                "right",
                                                                        }}
                                                                    >
                                                                        مبلغ
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(
                                                                    row as any
                                                                ).balancies?.map(
                                                                    (
                                                                        currency: any,
                                                                        index: number,
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    currency
                                                                                        .currency
                                                                                        .name
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {new Intl.NumberFormat(
                                                                                    "en",
                                                                                ).format(
                                                                                    currency.balance,
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    ),
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </MenuList>
                                                </Menu>
                                            </Dropdown>
                                        </td>
                                        <td>{index + 1}</td>
                                        <td> {row.name} </td>
                                        <td> {row.agent_name} </td>
                                        <td> {row.phone} </td>
                                        <td> {row.province} </td>
                                        <td>
                                            {" "}
                                            <Chip color="primary">
                                                {row.code}
                                            </Chip>{" "}
                                        </td>
                                        <td> {(row.branch as any).name} </td>
                                        <td>
                                            {" "}
                                            <ResolveStatus
                                                status={row.status as number}
                                            />{" "}
                                        </td>
                                        <td> {row.address} </td>
                                        <td> {row.email} </td>
                                        <td> {row.created_at} </td>
                                    </tr>
                                );
                            })}
                        {emptyRows > 0 && (
                            <tr
                                style={
                                    {
                                        height: `calc(${emptyRows} * 40px)`,
                                        "--TableRow-hoverBackground":
                                            "transparent",
                                    } as React.CSSProperties
                                }
                            >
                                <td colSpan={6} aria-hidden />
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={headCells.length}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        justifyContent: "flex-start",
                                    }}
                                >
                                    <FormControl
                                        orientation="horizontal"
                                        size="sm"
                                    >
                                        <FormLabel></FormLabel>
                                        <Select
                                            onChange={handleChangeRowsPerPage}
                                            value={rowsPerPage}
                                        >
                                            <Option value={5}>5</Option>
                                            <Option value={10}>10</Option>
                                            <Option value={25}>25</Option>
                                        </Select>
                                    </FormControl>
                                    <Typography
                                        textAlign="center"
                                        sx={{ minWidth: 80 }}
                                    >
                                        {labelDisplayedRows({
                                            from:
                                                rows.length === 0
                                                    ? 0
                                                    : page * rowsPerPage + 1,
                                            to: getLabelDisplayedRowsTo(),
                                            count:
                                                rows.length === -1
                                                    ? -1
                                                    : rows.length,
                                        })}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={
                                                rows.length !== -1
                                                    ? page >=
                                                      Math.ceil(
                                                          rows.length /
                                                              rowsPerPage,
                                                      ) -
                                                          1
                                                    : false
                                            }
                                            onClick={() =>
                                                handleChangePage(page + 1)
                                            }
                                            sx={{
                                                bgcolor: "background.surface",
                                            }}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                        <IconButton
                                            size="sm"
                                            color="neutral"
                                            variant="outlined"
                                            disabled={page === 0}
                                            onClick={() =>
                                                handleChangePage(page - 1)
                                            }
                                            sx={{
                                                bgcolor: "background.surface",
                                            }}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
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
        </Grid>
    );
}
