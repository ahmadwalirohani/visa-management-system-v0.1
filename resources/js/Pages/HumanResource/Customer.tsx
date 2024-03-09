import { Box, Typography, Card, Grid } from "@mui/joy";

import { Head } from "@inertiajs/react";
import AddCustomer from "./Partials/AddCustomer";

function Customer() {
    return (
        <>
            <Head title="مشتري" />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: { xs: "calc(12px + var(--Header-height))", md: 5 },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100dvh",
                    gap: 1,
                    overflow: "auto",
                }}
            >
                <Card sx={{ flex: 1, width: "100%" }}>
                    <Box
                        sx={{
                            position: "sticky",
                            top: { md: 5 },
                            bgcolor: "background.body",
                        }}
                    >
                        <Box sx={{ px: { xs: 2, md: 6 } }}>
                            <Typography
                                level="h3"
                                component="h1"
                                sx={{ mt: 0, mb: 0 }}
                            >
                                مشتريان
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                height: "78vh",
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid xl={3} md={3} sm={12}>
                                    <AddCustomer />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </>
    );
}

export default Customer;
