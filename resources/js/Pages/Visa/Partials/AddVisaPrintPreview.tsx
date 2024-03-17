import {
    Box,
    Card,
    CardContent,
    Grid,
    Sheet,
    Table,
    Typography,
} from "@mui/joy";
import Barcode from "react-barcode";
import moment from "jalali-moment";

interface IProps {
    formData: any;
    visaId: any;
    visaType: any;
    visaEntranceType: any;
}

function AddVisaPrintPreview({
    formData,
    visaId,
    visaEntranceType,
    visaType,
}: IProps) {
    return (
        <Grid md={4}>
            <Card
                sx={{
                    height: "85dvh",
                }}
            >
                <CardContent>
                    <Box display={"flex"} flexWrap={"nowrap"} height={200}>
                        <Sheet
                            sx={{
                                width: "50%",
                                display: "flex",
                                flexWrap: "wrap",
                                alignContent: "space-between",
                                justifyContent: "center",
                            }}
                        >
                            {formData.basic_type == "urgent" && (
                                <img
                                    style={{
                                        width: "100%",
                                    }}
                                    src="/urgent.png"
                                />
                            )}

                            <Typography level="h3" sx={{ mt: 5 }}>
                                {formData.passport_no}
                            </Typography>
                        </Sheet>
                        <Sheet sx={{ width: "50%" }}>
                            <img
                                style={{
                                    width: "100%",
                                }}
                                src="https://system.azizivisaservices.com/assets/images/Logo-images/azizi-logo.png"
                            />
                        </Sheet>
                    </Box>
                    <Box height={"fit-content"}>
                        <Sheet>
                            <Table
                                sx={{
                                    "& tr > th": {
                                        textAlign: "right",
                                        width: 120,
                                    },

                                    tableLayout: "auto",
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <th>نام و تخلص</th>
                                        <td>{formData.name}</td>
                                    </tr>
                                    <tr>
                                        <th>نوع ویزا</th>
                                        <td>
                                            {visaType} {visaEntranceType}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            {formData.block_no && "بلاک"}{" "}
                                            {!formData.block_no && "تفصیل"}
                                        </th>
                                        <td>
                                            {formData.block_no &&
                                                formData.block_no}{" "}
                                            {!formData.block_no &&
                                                formData.remarks}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>مربوط</th>
                                        <td> {formData.customer?.name} </td>
                                    </tr>
                                    <tr>
                                        <th>تاریخ</th>
                                        <td>
                                            {moment()
                                                .locale("fa")
                                                .format("YYYY/MM/DD")}
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Sheet>
                    </Box>
                    <Box margin={"auto"}>
                        <Barcode value={(visaId || 0).toString()} />
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default AddVisaPrintPreview;
