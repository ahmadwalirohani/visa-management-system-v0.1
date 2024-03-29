import { Head } from "@inertiajs/react";
import { Box, Card, CardContent, Grid } from "@mui/joy";
import AddJournalEntry from "./Partials/AddJournalEntry";

function JournalEntry() {
    return (
        <>
            <Head title="روزنامچه" />
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
                <Grid
                    container
                    spacing={2}
                    sx={{ overflow: { md: "hidden" }, width: "100%" }}
                >
                    <AddJournalEntry />
                    <Grid md={8}>
                        <Card
                            sx={{
                                m: 0,
                                height: { md: "90dvh", sm: "fit-content" },
                            }}
                        >
                            <CardContent></CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default JournalEntry;
