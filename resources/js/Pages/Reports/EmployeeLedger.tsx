import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import { Head } from "@inertiajs/react";
import { Box, Grid } from "@mui/joy";
import ViewEmployeeLedger from "./Partials/ViewEmployeeLedger";
//import ViewEmployeeLedger from "./Partials/ViewEmployeeLedger";
function EmployeeLedger() {
    const { privileges } = useUserBranchesContext();
    return (
        <>
            <Head title="کارمند کهاته" />
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
                    {privileges.employee.reports.ledger && (
                        <ViewEmployeeLedger />
                    )}
                </Grid>
            </Box>
        </>
    );
}

export default EmployeeLedger;
