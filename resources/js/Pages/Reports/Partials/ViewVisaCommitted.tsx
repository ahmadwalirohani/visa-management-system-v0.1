import * as React from "react";
import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";

import LinearProgress from "@mui/joy/LinearProgress";

import { ColorPaletteProp, Grid, Snackbar } from "@mui/joy";
import { useEventEmitter } from "../VisaCommitReport";

import VisaCommittedRow from "../Components/VisaCommittedRow";
import { getCommitedVisas } from "@/Utils/FetchReports";

interface Data {
    id: number;
    name: string;
    code: string;
    status: number;
    created_at: string;
    branch: any;
    actions: string;
}

export default function ViewVisaCommitted() {
    const [rows, setRows] = React.useState<Data[]>([]);
    const [useFetchLoader, setFetchLoading] = React.useState<boolean>(false);

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = React.useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const loadReport = () => {
        setFetchLoading(true);
        getCommitedVisas({}, (visas: Array<object>): void => {
            setRows([...(visas as Data[])]);
            setFetchLoading(false);
        });
    };

    const { addEventListener } = useEventEmitter();

    React.useEffect(() => {
        addEventListener("ReloadReportEvent", function (isFetch = false): void {
            if (isFetch) loadReport();
        });
        if (!rows.length) loadReport();
        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener(
                "ReloadReportEvent",
                function (isFetch = false): void {
                    if (isFetch) loadReport();
                },
            );
        };
    }, []);

    return (
        <Grid xl={9} md={9} sm={12}>
            <Typography level="h3" component="h1" sx={{ mt: 0, mb: 0 }}>
                تسلیم ویزي
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
                            <th style={{ textAlign: "right" }}>عکس</th>
                            <th style={{ textAlign: "right" }}>شرکت</th>
                            <th style={{ textAlign: "right" }}>نوم</th>
                            <th style={{ textAlign: "right" }}>تفصیل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any, index: number) => (
                            <VisaCommittedRow
                                key={row.id}
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
