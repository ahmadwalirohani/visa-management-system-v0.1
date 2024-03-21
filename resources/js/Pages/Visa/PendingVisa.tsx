import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";

import Link from "@mui/joy/Link";

import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import LinearProgress from "@mui/joy/LinearProgress";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Head } from "@inertiajs/react";
import {
    Card,
    ColorPaletteProp,
    ModalDialogProps,
    Snackbar,
    Typography,
} from "@mui/joy";
import { IPagination, IVisaPendingFilterProps, IVisaProps } from "@/types";
import { getPendingVisas } from "@/Utils/FetchResources";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Chip from "@mui/joy/Chip";
import axios, { AxiosError } from "axios";
import TablePagination from "@/Components/TablePagination";
import PendingVisaFilter from "./Partials/PendingVisaFilter";
import Edit from "@mui/icons-material/Edit";
import Print from "@mui/icons-material/Print";
import Printer from "@/Utils/Printer";
import EditVisaInfo from "./Partials/EditVisaInfo";
import { SendActionRequest } from "@/Utils/helpers";
import { MenuList } from "@mui/material";
import VisaBookingModel from "./Partials/VisaBookingModel";
import VisaOrderingModel from "./Partials/VisaOrderingModel";
import VisaCancelModel from "./Partials/VisaCancelMode";

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
    customer: {
        id: number;
        name: string;
    };
    created_at: string;
    id: number;
    visa_no: number;
    type: {
        id: number;
        name: string;
    };
    entrance_type: {
        id: number;
        name: string;
    };
    status: string;
}

export default function PendingVisa() {
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
    const [useVisaStatusProps, setVisaStatusProps] = React.useState({
        bookedLayout: false,
        turn_date: new Date(),
        orderLayout: false,
        cancelLayout: false,
    });
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });
    const [useVisaForm, setVisaForm] = React.useState<IVisaProps | any>({
        basic_type: "normal",
        visa_type: 0,
        visa_entrance_type: null,
        customer: null,
        province: "",
        job: "",
        passport_no: "",
        block_no: "",
        currency: 0,
        price: 0,
        name: "",
        remarks: "",
        id: 0,
    });

    const [layout, setLayout] = React.useState<
        ModalDialogProps["layout"] | undefined
    >(undefined);
    const [useFilterOptions, setFilterOptions] =
        React.useState<IVisaPendingFilterProps>({
            branch: 0,
            search: "",
            status: "",
            type: 0,
            customer: null,
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
            getPendingVisas(useFilterOptions, (response: any) =>
                callback(response),
            );
    };

    const handleOnChange = (newValue: any, field: string): void => {
        setFilterOptions((prevState) => ({
            ...prevState,
            [field]: newValue,
        }));
    };

    const handleFormChange = (
        newValue: any,
        field: string,
        isAdvancePayment: boolean = false,
    ): void => {
        if (!isAdvancePayment)
            setVisaForm((prevState: any) => ({
                ...prevState,
                [field]: newValue,
            }));
    };

    const onPrint = (visa: Data): void => {
        Printer(
            `/print/visa-label-format/${visa.visa_no}/${visa.basic_type == "urgent" ? 1 : 0}`,
            {
                name: visa.name,
                customer: visa.customer?.name,
                type: `${visa.type.name} ${visa.entrance_type.name}`,
                dynamic_type: visa.block_no ? "بلاک" : "تفصیل",
                dynamic_value: visa.block_no ? visa.block_no : visa.remarks,
            },
        );
    };

    const openEditDialog = (state: any) => {
        setLayout(state);
    };

    const openBookingDialog = (state: any, is_updated: boolean) => {
        setVisaStatusProps((prevState) => ({
            ...prevState,
            bookedLayout: state as boolean,
        }));

        if (is_updated) {
            setSnackbar({
                msg: "معلومات په بریالي سره ثبت سول",
                state: "success",
                is_open: true,
            });
            LoadRows();
        }
    };

    const openOrderingDialog = (state: any, is_updated: boolean) => {
        setVisaStatusProps((prevState) => ({
            ...prevState,
            orderLayout: state as boolean,
        }));

        if (is_updated) {
            setSnackbar({
                msg: "معلومات په بریالي سره ثبت سول",
                state: "success",
                is_open: true,
            });
            LoadRows();
        }
    };

    const openCancelDialog = (state: any, is_updated: boolean) => {
        setVisaStatusProps((prevState) => ({
            ...prevState,
            cancelLayout: state as boolean,
        }));

        if (is_updated) {
            setSnackbar({
                msg: "معلومات په بریالي سره ثبت سول",
                state: "success",
                is_open: true,
            });
            LoadRows();
        }
    };

    const onEditSubmit = () => {
        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "edit_visa",
                _validation_class: "CreateVisa",
            },
            Object.assign({}, useVisaForm),
        );
        setFetchLoading(true);

        axios
            .post(Config.url, Config.payload)
            .then((): void => {
                setSnackbar({
                    msg: "معلومات په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });

                setVisaForm({
                    basic_type: "normal",
                    visa_type: 0,
                    visa_entrance_type: null,
                    customer: null,
                    province: "",
                    job: "",
                    passport_no: "",
                    block_no: "",
                    currency: 0,
                    price: 0,
                    name: "",
                    remarks: "",
                    id: 1,
                });

                openEditDialog(undefined);

                LoadRows();
            })
            .catch((Error: AxiosError<any>): void => {
                setSnackbar({
                    msg: Error.response?.data.message,
                    state: "danger",
                    is_open: true,
                });
            })
            .finally(() => setFetchLoading(false));
    };

    React.useEffect(() => {
        LoadRows();
    }, [useFilterOptions]);

    function RowMenu({ visa }: any) {
        return (
            <React.Fragment>
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
                    <Menu size="sm" sx={{ minWidth: 140 }}>
                        <MenuItem
                            onClick={() => {
                                openEditDialog("center");
                                setVisaForm({
                                    customer: visa.customer,
                                    basic_type: visa.basic_type,
                                    visa_type: visa.type_id,
                                    visa_entrance_type: visa.entrance_type,
                                    province: visa.province || "",
                                    job: visa.job,
                                    passport_no: visa.passport_no,
                                    block_no: visa.block_no,
                                    currency: visa.currency_id,
                                    price: visa.price,
                                    name: visa.name,
                                    remarks: visa.remarks || "",
                                    id: visa.id,
                                });
                            }}
                        >
                            <Edit />
                            تغیر
                        </MenuItem>
                        <MenuItem onClick={() => onPrint(visa)}>
                            <Print />
                            چاپ
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setVisaForm((prevState: any) => ({
                                    ...prevState,
                                    id: visa.id,
                                }));
                                openBookingDialog(true, false);
                            }}
                            disabled={
                                visa.status == "booked" ||
                                visa.status == "ordered"
                            }
                        >
                            <DoneAllIcon />
                            ثبت شد
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setVisaForm((prevState: any) => ({
                                    ...prevState,
                                    id: visa.id,
                                }));
                                openOrderingDialog(true, false);
                            }}
                            disabled={
                                visa.status == "ordered" ||
                                visa.status == "registration"
                            }
                        >
                            <FactCheckIcon />
                            دستور شد
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            color="danger"
                            onClick={() => {
                                setVisaForm((prevState: any) => ({
                                    ...prevState,
                                    id: visa.id,
                                }));
                                openCancelDialog(true, false);
                            }}
                        >
                            <DoNotDisturbIcon />
                            کنسل
                        </MenuItem>

                        <Divider />
                        <MenuList>
                            <Table
                                size="sm"
                                sx={{
                                    width: "200px",
                                    tableLayout: "auto",
                                    "& tr > th": {
                                        textAlign: "right",
                                    },
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th>پیشکي رسید مبلغ</th>
                                        <td>
                                            {visa.paid_amount}{" "}
                                            {visa.currency.symbol}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>باقي مبلغ</th>
                                        <td>
                                            {visa.price - visa.paid_amount}{" "}
                                            {visa.currency.symbol}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </MenuList>
                    </Menu>
                </Dropdown>
            </React.Fragment>
        );
    }

    return (
        <>
            <Head title="معطلي ویزي" />
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
                <Card sx={{ m: 0, width: "100%", height: "88vh" }}>
                    <div style={{ height: 2 }}>
                        {useFetchLoader == true && <LinearProgress size="sm" />}
                    </div>

                    <PendingVisaFilter
                        onChange={handleOnChange}
                        useFilter={useFilterOptions}
                    />

                    <Sheet
                        className="OrderTableContainer"
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
                                    <th
                                        style={{
                                            width: 48,
                                            textAlign: "center",
                                            padding: "12px 6px",
                                        }}
                                    ></th>
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
                                            شماره لییل
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
                                        شرکت / مشتري
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        نام و تخلص
                                    </th>

                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        پاسپورټ
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        حالت
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        پلیټ نمبر
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        قیمت
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        وظیفه
                                    </th>

                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        نوع ویزا
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    >
                                        نوعیت دخول
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
                                    <tr key={row.id}>
                                        <td>
                                            <RowMenu visa={row as Data} />
                                        </td>
                                        <td>{row.visa_no}</td>
                                        <td>
                                            {row.created_at.substring(0, 10)}
                                            <Typography
                                                level="body-xs"
                                                sx={{ display: "flex" }}
                                            >
                                                {row.status !=
                                                    "registration" && (
                                                    <Chip size="sm">
                                                        {row.booked_date?.substring(
                                                            0,
                                                            10,
                                                        )}
                                                    </Chip>
                                                )}
                                                {row.status == "ordered" && (
                                                    <Chip
                                                        color="primary"
                                                        size="sm"
                                                    >
                                                        {row.ordered_date?.substring(
                                                            0,
                                                            10,
                                                        )}
                                                    </Chip>
                                                )}
                                            </Typography>
                                        </td>
                                        <td>{row.customer.name}</td>
                                        <td>{row.name}</td>
                                        <td>{row.passport_no}</td>
                                        <td>
                                            <Chip
                                                variant="soft"
                                                startDecorator={
                                                    {
                                                        registration: (
                                                            <TaskAltIcon />
                                                        ),
                                                        ordered: (
                                                            <PriceCheckIcon />
                                                        ),
                                                        booked: (
                                                            <FactCheckIcon />
                                                        ),
                                                    }[row.status]
                                                }
                                                color={
                                                    {
                                                        registration: "success",
                                                        ordered: "primary",
                                                        booked: "neutral",
                                                    }[
                                                        row.status
                                                    ] as ColorPaletteProp
                                                }
                                            >
                                                {
                                                    {
                                                        registration: "راجسټر",
                                                        booked: "ثبت شد",
                                                        ordered: "دستور شد",
                                                        completed: "جاري",
                                                    }[row.status]
                                                }
                                            </Chip>
                                        </td>
                                        <td>{row.block_no}</td>
                                        <td>
                                            {new Intl.NumberFormat("en").format(
                                                row.price,
                                            )}{" "}
                                            {(row.currency as any).symbol}
                                        </td>
                                        <td>{row.job}</td>
                                        <td>{row.type.name}</td>
                                        <td>{row.entrance_type.name}</td>
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
            </Box>

            <EditVisaInfo
                formData={useVisaForm}
                onChange={handleFormChange}
                onSubmit={onEditSubmit}
                loading={useFetchLoader}
                setLayoutState={openEditDialog}
                layout={layout}
            />

            <VisaBookingModel
                setOpenState={openBookingDialog}
                openState={useVisaStatusProps.bookedLayout}
                id={useVisaForm.id}
            />
            <VisaOrderingModel
                setOpenState={openOrderingDialog}
                openState={useVisaStatusProps.orderLayout}
                id={useVisaForm.id}
            />

            <VisaCancelModel
                id={useVisaForm.id}
                openState={useVisaStatusProps.cancelLayout}
                setOpenState={openCancelDialog}
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
