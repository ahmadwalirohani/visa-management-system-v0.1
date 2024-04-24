import { Head } from "@inertiajs/react";
import { Box, Grid } from "@mui/joy";
import ViewProceedVisaReport from "./Partials/ViewProceedVisaReport";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

function ProceedVisaReport() {
    const { privileges } = useUserBranchesContext();

    return (
        <>
            <Head title="جاري ویزو راپور" />
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
                    overflow: {
                        md: "hidden",
                        sm: "auto",
                        xl: "hidden",
                    },
                }}
            >
                <Grid
                    container
                    spacing={1}
                    sx={{
                        alignItems: "flex-end",
                    }}
                >
                    {privileges.visa.reports.proceed && (
                        <ViewProceedVisaReport />
                    )}
                </Grid>
            </Box>
        </>
    );
}

export default ProceedVisaReport;
