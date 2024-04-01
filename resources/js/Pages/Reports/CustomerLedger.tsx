import { Head } from "@inertiajs/react";
import { Box, Grid } from "@mui/joy";
import ViewCustomerLedger from "./Partials/ViewCustomerLedger";

function CustomerLedger() {
    return (
        <>
            <Head title="مشتري کهاته" />
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
                    <ViewCustomerLedger />
                </Grid>
            </Box>
        </>
    );
}

export default CustomerLedger;
