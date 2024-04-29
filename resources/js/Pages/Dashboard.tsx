import { StyledEngineProvider } from "@mui/styled-engine-sc";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import { Head } from "@inertiajs/react";
import { Box, Grid } from "@mui/joy";
import { BarChart } from "@mui/x-charts";
import UserLogs from "./DashboardPartials/UserLogs";

export default function Dashboard() {
    const branches = useUserBranchesContext();

    return (
        <>
            <Head title="ډاشبورډ" />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: { xs: "calc(12px + var(--Header-height))", md: 7 },
                    pb: { xs: 2, sm: 2, md: 1 },
                    pr: { md: 3 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100dvh",
                    gap: 1,
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                <Grid container spacing={2}>
                    <UserLogs />
                </Grid>

                <StyledEngineProvider injectFirst={false}>
                    <BarChart
                        xAxis={[
                            {
                                id: "barCategories",
                                data: ["bar A", "bar B", "bar C"],
                                scaleType: "band",
                            },
                        ]}
                        series={[
                            {
                                data: [2, 5, 3],
                            },
                        ]}
                        width={500}
                        height={300}
                    />
                </StyledEngineProvider>

                {branches.selectedBranch}
            </Box>
        </>
    );
}
