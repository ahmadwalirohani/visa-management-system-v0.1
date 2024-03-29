import * as React from "react";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { GetTills } from "@/Utils/FetchResources";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LinearProgress from "@mui/joy/LinearProgress";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
    Button,
    ButtonGroup,
    Chip,
    ColorPaletteProp,
    Grid,
    IconButton,
    Sheet,
    Snackbar,
} from "@mui/joy";
import { useEventEmitter } from "../Tills";
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ChangeResourceStatus from "@/Utils/ChangeResourceStatus";

interface Data {
    id: number;
    name: string;
    code: string;
    status: number;
    created_at: string;
    branch: any;
    actions: string;
}

export default function ViewTill() {
    const [rows, setRows] = React.useState<Data[]>([]);
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const LoadTills = () => {
        setFetchLoading(true);
        GetTills((tills: Array<object>): void => {
            setRows([...(tills as Data[])]);
            setFetchLoading(false);
        });
    };

    const { emitEvent, addEventListener } = useEventEmitter();

    const SendTillToForm = (payload: any) => {
        emitEvent("SendPayloadToFormEvent", payload);
    };

    React.useEffect(() => {
        addEventListener("ReloadTillsEvent", function (isFetch = false): void {
            if (isFetch) LoadTills();
        });
        if (!rows.length) LoadTills();
        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener(
                "ReloadTillsEvent",
                function (isFetch = false): void {
                    if (isFetch) LoadTills();
                },
            );
        };
    }, []);

    const onTillStatusChange = (till: any): void => {
        ChangeResourceStatus({
            id: till.id,
            model: "Till",
            status: till.status as number,
            onSend() {},
            afterChange() {
                setSnackbar({
                    msg: `دخل په بریالي سره ${till.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadTills();
            },
        });
    };

    function Row(props: { row: any; initialOpen?: boolean }) {
        const { row } = props;
        const [open, setOpen] = React.useState(props.initialOpen || false);

        return (
            <React.Fragment>
                <tr>
                    <td>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}
                        >
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
                            <div>{row.id}</div>
                        </div>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.branch.name}</td>
                    <td>{row.code}</td>
                    <td style={{ width: 120 }}>
                        {row.status == 1 && (
                            <Chip variant="outlined" color="success">
                                فعاله
                            </Chip>
                        )}
                        {row.status == 0 && (
                            <Chip variant="outlined" color="danger">
                                غیري فعاله
                            </Chip>
                        )}
                    </td>
                    <td dir="ltr" style={{ width: 100 }}>
                        <ButtonGroup>
                            <Button
                                onClick={() => onTillStatusChange(row)}
                                title="دخل ډول حالت تغیرول"
                            >
                                {row.status == 1 && <VisibilityOff />}
                                {row.status == 0 && <Visibility />}
                            </Button>
                            <Button onClick={() => SendTillToForm(row)}>
                                <Edit />
                            </Button>
                        </ButtonGroup>
                    </td>
                </tr>
                <tr>
                    <td style={{ height: 0, padding: 0 }} colSpan={6}>
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
                                    دخل موجودي
                                </Typography>
                                <Table
                                    borderAxis="bothBetween"
                                    size="sm"
                                    aria-label="purchases"
                                    sx={{
                                        "& > thead > tr > th": {
                                            textAlign: "right",
                                        },
                                        "--TableCell-paddingX": "0.5rem",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>مبلغ</th>
                                            <th>اسعار</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {row.balancies?.map(
                                            (balance: any, pi: number) => (
                                                <tr key={pi}>
                                                    <td scope="row">
                                                        {balance.id}
                                                    </td>
                                                    <td>
                                                        {new Intl.NumberFormat(
                                                            "en",
                                                        ).format(
                                                            balance.balance,
                                                        )}
                                                    </td>
                                                    <td>
                                                        {balance.currency.name}
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
        <Grid xl={9} md={9} sm={12}>
            <Typography level="h3" component="h1" sx={{ mt: 0, mb: 0 }}>
                دخلونه
            </Typography>
            <div style={{ height: 5 }}>
                {useFetchLoader && <LinearProgress />}
            </div>
            <Box
                sx={{
                    px: { xs: 2, md: 0 },
                    overflow: "auto",
                    height: "80vh",
                }}
            >
                <Table
                    aria-label="visa types table"
                    stickyHeader
                    stickyFooter
                    hoverRow
                    sx={{
                        "& > thead > tr > th:nth-child(n + 3), & > tbody > tr > td:nth-child(n + 3)":
                            { textAlign: "right" },
                        '& > tbody > tr:nth-child(odd) > td, & > tbody > tr:nth-child(odd) > th[scope="row"]':
                            {
                                borderBottom: 0,
                            },
                        tableLayout: "auto",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ textAlign: "right" }}>#</th>
                            <th style={{ textAlign: "right" }}>نوم</th>
                            <th style={{ textAlign: "right" }}>څانګه</th>
                            <th style={{ textAlign: "right" }}>کود</th>
                            <th style={{ textAlign: "right" }}>حالت</th>
                            <th style={{ textAlign: "right" }}>عملیی</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, index: number) => (
                            <Row
                                key={row.name}
                                row={row}
                                initialOpen={index === 0}
                            />
                        ))}
                    </tbody>
                </Table>
            </Box>

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
