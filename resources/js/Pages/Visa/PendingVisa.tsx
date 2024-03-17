import * as React from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { Head } from "@inertiajs/react";
import { Card } from "@mui/joy";

const rows = [
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
    {
        id: "V-1234",
        date: "Feb 3, 2023",
        status: "Refunded",
        customer: {
            initial: "O",
            name: "Olivia Ryhe",
            email: "olivia@email.com",
        },
        job: "none",
        type: "tegari",
        entrance_type: "npting",
        passport_no: "p-123123",
        block_no: "B-12312",
        remarks: "none",
    },
];

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
function stableSort<T>(
    array: readonly T[],
    comparator: (a: T, b: T) => number,
) {
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

function RowMenu() {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                    root: { variant: "plain", color: "neutral", size: "sm" },
                }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Move</MenuItem>
                <Divider />
                <MenuItem color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function PendingVisa() {
    const [order, setOrder] = React.useState<Order>("desc");
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const renderFilters = () => (
        <React.Fragment>
            <FormControl size="sm">
                <FormLabel>حالت</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                >
                    <Option value="paid">معطلي</Option>
                    <Option value="pending">ثبت نام شد</Option>
                    <Option value="refunded">دستور</Option>
                    <Option value="cancelled">لغوه</Option>
                </Select>
            </FormControl>
            <FormControl size="sm">
                <FormLabel>نوع ویزه</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="refund">Refund</Option>
                    <Option value="purchase">Purchase</Option>
                    <Option value="debit">Debit</Option>
                </Select>
            </FormControl>
            <FormControl size="sm">
                <FormLabel>مشتري</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="olivia">Olivia Rhye</Option>
                    <Option value="steve">Steve Hampton</Option>
                    <Option value="ciaran">Ciaran Murray</Option>
                    <Option value="marina">Marina Macdonald</Option>
                    <Option value="charles">Charles Fulton</Option>
                    <Option value="jay">Jay Hoper</Option>
                </Select>
            </FormControl>
        </React.Fragment>
    );
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
                <Card sx={{ m: 0, width: "100%", height: "90vh" }}>
                    <Box
                        className="SearchAndFilters-tabletUp"
                        sx={{
                            borderRadius: "sm",
                            py: 2,
                            display: { xs: "none", sm: "flex" },
                            flexWrap: "wrap",
                            gap: 1.5,
                            "& > *": {
                                minWidth: { xs: "100px", md: "150px" },
                            },
                        }}
                    >
                        <FormControl sx={{ flex: 1 }} size="sm">
                            <FormLabel>ویزي پلټنه</FormLabel>
                            <Input size="sm" startDecorator={<SearchIcon />} />
                        </FormControl>
                        {renderFilters()}
                    </Box>
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
                                    >
                                        <Checkbox
                                            size="sm"
                                            indeterminate={
                                                selected.length > 0 &&
                                                selected.length !== rows.length
                                            }
                                            checked={
                                                selected.length === rows.length
                                            }
                                            onChange={(event) => {
                                                setSelected(
                                                    event.target.checked
                                                        ? rows.map(
                                                              (row) => row.id,
                                                          )
                                                        : [],
                                                );
                                            }}
                                            color={
                                                selected.length > 0 ||
                                                selected.length === rows.length
                                                    ? "primary"
                                                    : undefined
                                            }
                                            sx={{
                                                verticalAlign: "text-bottom",
                                            }}
                                        />
                                    </th>
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
                                        وظیفه
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
                                        حالت
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
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
                                        مشتري
                                    </th>
                                    <th
                                        style={{
                                            width: 140,
                                            padding: "12px 6px",
                                        }}
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {stableSort(
                                    rows,
                                    getComparator(order, "id"),
                                ).map((row) => (
                                    <tr key={row.id}>
                                        <td
                                            style={{
                                                textAlign: "center",
                                                width: 120,
                                            }}
                                        >
                                            <Checkbox
                                                size="sm"
                                                checked={selected.includes(
                                                    row.id,
                                                )}
                                                color={
                                                    selected.includes(row.id)
                                                        ? "primary"
                                                        : undefined
                                                }
                                                onChange={(event) => {
                                                    setSelected((ids) =>
                                                        event.target.checked
                                                            ? ids.concat(row.id)
                                                            : ids.filter(
                                                                  (itemId) =>
                                                                      itemId !==
                                                                      row.id,
                                                              ),
                                                    );
                                                }}
                                                slotProps={{
                                                    checkbox: {
                                                        sx: {
                                                            textAlign: "left",
                                                        },
                                                    },
                                                }}
                                                sx={{
                                                    verticalAlign:
                                                        "text-bottom",
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <Typography level="body-xs">
                                                {row.id}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography level="body-xs">
                                                {row.date}
                                            </Typography>
                                        </td>
                                        <td>
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                startDecorator={
                                                    {
                                                        Paid: (
                                                            <CheckRoundedIcon />
                                                        ),
                                                        Refunded: (
                                                            <AutorenewRoundedIcon />
                                                        ),
                                                        Cancelled: (
                                                            <BlockIcon />
                                                        ),
                                                    }[row.status]
                                                }
                                                color={
                                                    {
                                                        Paid: "success",
                                                        Refunded: "neutral",
                                                        Cancelled: "danger",
                                                    }[
                                                        row.status
                                                    ] as ColorPaletteProp
                                                }
                                            >
                                                {row.status}
                                            </Chip>
                                        </td>

                                        <td>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Link
                                                    level="body-xs"
                                                    component="button"
                                                >
                                                    Download
                                                </Link>
                                                <RowMenu />
                                            </Box>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Avatar size="sm">
                                                    {row.customer.initial}
                                                </Avatar>
                                                <div>
                                                    <Typography level="body-xs">
                                                        {row.customer.name}
                                                    </Typography>
                                                    <Typography level="body-xs">
                                                        {row.customer.email}
                                                    </Typography>
                                                </div>
                                            </Box>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                    <Box
                        className="Pagination-laptopUp"
                        sx={{
                            pt: 2,
                            gap: 1,
                            [`& .${iconButtonClasses.root}`]: {
                                borderRadius: "50%",
                            },
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                        }}
                    >
                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            startDecorator={<KeyboardArrowLeftIcon />}
                        >
                            Previous
                        </Button>

                        <Box sx={{ flex: 1 }} />
                        {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
                            <IconButton
                                key={page}
                                size="sm"
                                variant={Number(page) ? "outlined" : "plain"}
                                color="neutral"
                            >
                                {page}
                            </IconButton>
                        ))}
                        <Box sx={{ flex: 1 }} />

                        <Button
                            size="sm"
                            variant="outlined"
                            color="neutral"
                            endDecorator={<KeyboardArrowRightIcon />}
                        >
                            Next
                        </Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
