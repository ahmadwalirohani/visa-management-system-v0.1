import { Head } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    Switch,
    Input,
    Select,
    Typography,
    VariantProp,
    Textarea,
    Table,
} from "@mui/joy";
import { ChangeEvent, useState } from "react";

function JournalEntry() {
    const [checked, setChecked] = useState<boolean>(false);

    return (
        <>
            <Head title="روزنامجه" />
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
                    <Grid md={4}>
                        <Card
                            sx={{
                                m: 0,
                                height: { md: "90dvh", sm: "fit-content" },
                            }}
                        >
                            <CardContent>
                                <Typography level="h4" mb={2}>
                                    روزنامچه رسول
                                </Typography>
                                <Grid
                                    container
                                    spacing={1}
                                    sx={{ overflow: "hidden" }}
                                >
                                    <Grid md={6}>
                                        <FormControl size="sm">
                                            <FormLabel>رسید ډول</FormLabel>
                                            <Select size="sm"></Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid md={6}>
                                        <FormControl size="sm">
                                            <FormLabel>برد ډول</FormLabel>
                                            <Select size="sm"></Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid md={8}>
                                        <FormControl size="sm">
                                            <FormLabel>رسید اکاونټ</FormLabel>
                                            <Select size="sm"></Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid md={4}>
                                        <Button
                                            variant="soft"
                                            color="success"
                                            fullWidth
                                            size="sm"
                                            sx={{ mt: 3 }}
                                        >
                                            افغاني
                                        </Button>
                                    </Grid>
                                    <Grid md={8}>
                                        <FormControl size="sm">
                                            <FormLabel>برد اکاونټ</FormLabel>
                                            <Select size="sm"></Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid md={4}>
                                        <Button
                                            fullWidth
                                            sx={{ mt: 3 }}
                                            variant="soft"
                                            color="danger"
                                            size="sm"
                                        >
                                            افغاني
                                        </Button>
                                    </Grid>
                                    <Grid md={4}>
                                        <FormControl size="sm">
                                            <FormLabel>مبلغ</FormLabel>
                                            <Input size="sm" />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={2}>
                                        <FormControl size="sm">
                                            <FormLabel>نرخ</FormLabel>
                                            <Input size="sm" />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={2}>
                                        <FormControl>
                                            <Switch
                                                checked={checked}
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setChecked(e.target.checked)
                                                }
                                                color={
                                                    checked
                                                        ? "success"
                                                        : "neutral"
                                                }
                                                variant={
                                                    (checked
                                                        ? "solid"
                                                        : "outlined") as VariantProp
                                                }
                                                endDecorator={
                                                    checked ? "/" : "x"
                                                }
                                                slotProps={{
                                                    endDecorator: {
                                                        sx: {
                                                            minWidth: 24,
                                                        },
                                                    },
                                                }}
                                                sx={{
                                                    mt: 3,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={4}>
                                        <FormControl size="sm">
                                            <FormLabel>متبادل مبلغ</FormLabel>
                                            <Input size="sm" />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <FormControl size="sm">
                                            <FormLabel>تفصیل</FormLabel>
                                            <Textarea size="sm" minRows={1} />
                                        </FormControl>
                                    </Grid>
                                    <Grid md={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid md={12}>
                                        <Table
                                            size="sm"
                                            sx={{
                                                "& tr > th": {
                                                    textAlign: "right",
                                                    width: 150,
                                                },
                                                tableLayout: "auto",
                                            }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <th>دخل نوي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>دخل نوي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>دخل نوي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>دخل نوي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th> پیشکي ویزو مبلغ</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        {" "}
                                                        انتخاب سوي ویزو مبلغ
                                                    </th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th> د ویزو باقي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th> د ویزو باقي حساب</th>
                                                    <td>
                                                        {" "}
                                                        <b>123213</b>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth>ثبت</Button>
                                <Button variant="soft">پاک</Button>
                                <Button color="neutral">چاپ</Button>
                                <Button fullWidth variant="outlined">
                                    جاري ویزي
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
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
