import {
    Card,
    CardContent,
    DialogTitle,
    ModalDialog,
    Modal,
    DialogContent,
    Grid,
    FormControl,
    Input,
    FormLabel,
    Table,
    Sheet,
} from "@mui/joy";

interface IProps {
    openState: {
        viewState: boolean;
    };
    infoProps: {
        start_date: string;
        end_date: string;
        working_days: number;
        details: Array<{
            id: number;
            employee: any;
            absence_days: number;
            presence_days: number;
            tax: number;
            overtime: number;
            net_salary: number;
            salary: number;
        }>;
    };
    setOpenState(state: boolean): void;
}

function ViewPayrollSheetModal({ openState, setOpenState, infoProps }: IProps) {
    return (
        <Modal
            open={openState.viewState}
            onClose={() => {
                setOpenState(false);
            }}
        >
            <ModalDialog>
                <DialogTitle>کارمندانو معاشاتو توزیع راپور</DialogTitle>
                <DialogContent
                    sx={{
                        width: "900px",
                        minHeight: "70dvh",
                        maxHeight: "70dvh",
                    }}
                >
                    <Card sx={{ height: "100dvh" }}>
                        <CardContent>
                            <Grid
                                container
                                spacing={2}
                                sx={{ alignItems: "flex-end" }}
                            >
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel>د پیل نیټه</FormLabel>
                                        <Input
                                            value={infoProps.start_date}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel>د ختم نیټه</FormLabel>
                                        <Input
                                            value={infoProps.end_date}
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel> کاري ورځي</FormLabel>
                                        <Input
                                            value={infoProps.working_days}
                                            type="number"
                                            readOnly
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid md={12} height={"30dvh"}>
                                    <Sheet
                                        sx={{
                                            height: "100%",
                                            width: "100%",
                                            overflow: "auto",
                                        }}
                                    >
                                        <Table
                                            borderAxis="xBetween"
                                            stickyHeader
                                            hoverRow
                                            variant="outlined"
                                            sx={{
                                                "& tr > *": {
                                                    textAlign: "right",
                                                },
                                                tableLayout: "auto",
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>نوم</th>
                                                    <th>کود</th>
                                                    <th>څانګه</th>
                                                    <th>وظیفه</th>
                                                    <th>معاش</th>
                                                    <th>حاضري</th>
                                                    <th>غیري حاضري</th>
                                                    <th>اضافه کاري</th>
                                                    <th>مالیه</th>
                                                    <th>خالص معاش</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {infoProps.details.map(
                                                    (
                                                        sheet: any,
                                                        index: number,
                                                    ) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {
                                                                    sheet
                                                                        .employee
                                                                        .name
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    sheet
                                                                        .employee
                                                                        .code
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    sheet
                                                                        .employee
                                                                        .branch
                                                                        .name
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    sheet
                                                                        .employee
                                                                        .job
                                                                }
                                                            </td>
                                                            <td>
                                                                {sheet.salary}
                                                            </td>
                                                            <td>
                                                                {
                                                                    sheet.presence_days
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    sheet.absence_days
                                                                }
                                                            </td>
                                                            <td>
                                                                {sheet.overtime}
                                                            </td>
                                                            <td>{sheet.tax}</td>
                                                            <td>
                                                                {
                                                                    sheet.net_salary
                                                                }
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>
                                        </Table>
                                    </Sheet>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}

export default ViewPayrollSheetModal;
