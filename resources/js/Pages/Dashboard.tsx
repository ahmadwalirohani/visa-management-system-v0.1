import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import { Head } from "@inertiajs/react";
import { Box } from "@mui/joy";

export default function Dashboard() {
    const branches = useUserBranchesContext();

    return (
        <>
            <Head title="ډاشبورډ" />
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
                {branches.selectedBranch}
            </Box>
        </>
    );
}
