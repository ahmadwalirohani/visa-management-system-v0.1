import * as React from "react";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { GetTills } from "@/Utils/FetchResources";

import LinearProgress from "@mui/joy/LinearProgress";

import { ColorPaletteProp, Grid, Snackbar } from "@mui/joy";
import { useEventEmitter } from "../Tills";

import ChangeResourceStatus from "@/Utils/ChangeResourceStatus";
import TillRow from "../Components/TillRow";
import TillOpenCloseView from "../Components/TillOpenCloseView";

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
    const [useDialogState, setDialogState] = React.useState<{
        state: boolean;
        id: number;
        is_open: number;
        balancies: Array<any>;
    }>({
        state: false,
        id: 0,
        is_open: 0,
        balancies: [],
    });

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const openViewTillDialog = (
        state: any,
        id: number = 0,
        is_open: number = 0,
        balancies: Array<any> = [],
    ) => {
        setDialogState({
            state,
            id,
            is_open,
            balancies,
        });
    };

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
                            <TillRow
                                key={row.name}
                                row={row}
                                onTillStatusChange={onTillStatusChange}
                                sendTillData={SendTillToForm}
                                initialOpen={index === 0}
                                openTillActionsView={openViewTillDialog}
                            />
                        ))}
                    </tbody>
                </Table>
            </Box>

            <TillOpenCloseView
                setOpenState={openViewTillDialog}
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
