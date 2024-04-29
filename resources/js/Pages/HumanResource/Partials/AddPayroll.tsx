import { GetEmployees, LoadCurrencies } from "@/Utils/FetchResources";
import { SendActionRequest } from "@/Utils/helpers";
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
    Button,
    Table,
    CardActions,
    Textarea,
    Sheet,
    Select,
    Option,
} from "@mui/joy";
import { AxiosError } from "axios";
import moment from "jalali-moment";
import { ChangeEvent, useEffect, useState } from "react";
import PayrollEditModal from "./PayrollEditModal";
import axiosInstance from "@/Pages/Plugins/axiosIns";

interface IProps {
    openState: {
        state: boolean;
    };
    showSnackbar(is_open: boolean, state: string, msg: string): void;
    setOpenState(state: boolean): void;
}

function AddPayroll({ openState, setOpenState, showSnackbar }: IProps) {
    const [useSheet, setSheet] = useState<Array<any>>([]);
    const [useCurrencies, setCurrencies] = useState<Array<any>>([]);
    const [useFormData, setFormData] = useState({
        start_date: moment().locale("fa").format("YYYY-MM-DD"),
        end_date: moment().locale("fa").format("YYYY-MM-DD"),
        remarks: "",
        working_days: 0,
        currency: 0,
        loading: false,
        id: null,
    });

    const [modelState, setModalState] = useState({
        state: false,
        obsence: null,
        tax: null,
        index: 0,
        overtime: null,
        net_salary: null,
    });

    const onSubmit = () => {
        if (
            useSheet.some((e) => e.presense > 0 && e.net_salary > 0) &&
            useSheet.length
        ) {
            setFormData((prev) => ({
                ...prev,
                loading: true,
            }));

            const Config = SendActionRequest(
                {
                    _class: "HRLogics",
                    _method_name: `add_payroll_sheet`,
                    _validation_class: null,
                },
                Object.assign(
                    {},
                    {
                        sheet: useSheet,
                    },
                    useFormData,
                ),
            );
            axiosInstance
                .post(Config.url, Config.payload)
                .then(() => {
                    setOpenState(false);
                    showSnackbar(true, "success", "عملیه په بریا سره اجرا سول");
                })
                .catch((Error: AxiosError<any>) => {
                    showSnackbar(true, "danger", Error.response?.data.message);
                })
                .finally(() =>
                    setFormData((prev) => ({
                        ...prev,
                        loading: false,
                    })),
                );
        }
    };

    const onChange = (field: string, value: any): void => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    useEffect(() => {
        GetEmployees(function (_employee: Array<any>): void {
            setSheet(
                _employee.map((c: any) => ({
                    id: c.id,
                    code: c.code,
                    name: c.name,
                    branch: c.branch.name,
                    salary: c.salary,
                    job: c.job,
                    presense: 0,
                    absence: null,
                    overtime: null,
                    net_salary: 0,
                    tax: null,
                })),
            );
        });

        LoadCurrencies(function (_currencies: Array<any>): void {
            setCurrencies(_currencies);
        });
    }, []);

    const closeDialog = (state: boolean) => {
        setModalState((prev) => ({
            ...prev,
            state,
        }));

        const _dump_rows = [...useSheet];

        _dump_rows[modelState.index] = {
            ..._dump_rows[modelState.index],
            absence: modelState.obsence,
            overtime: modelState.overtime,
            tax: modelState.tax,
            net_salary: modelState.net_salary,
        };

        setSheet(_dump_rows);
    };

    useEffect(() => {
        const _employees = [...useSheet].map((s) => ({
            ...s,
            presense: useFormData.working_days,
        }));

        setSheet(_employees);
    }, [useFormData.working_days]);

    useEffect(() => {
        if (!modelState.index) return void 0;
        setModalState((prev) => ({
            ...prev,
            net_salary: Number(
                useSheet[prev.index].salary +
                    Number(prev.overtime) -
                    Number(prev.tax),
            ) as any,
        }));
    }, [modelState.obsence, modelState.overtime, modelState.tax]);

    return (
        <Modal
            open={openState.state}
            onClose={() => {
                setOpenState(false);
            }}
        >
            <ModalDialog>
                <DialogTitle>کارمندانو معاشاتو توزیع</DialogTitle>
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
                                            value={useFormData.start_date}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    "start_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel>د ختم نیټه</FormLabel>
                                        <Input
                                            value={useFormData.end_date}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    "end_date",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel> کاري ورځي</FormLabel>
                                        <Input
                                            value={useFormData.working_days}
                                            type="number"
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    "working_days",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={3}>
                                    <FormControl>
                                        <FormLabel>اسعار</FormLabel>
                                        <Select
                                            value={useFormData.currency}
                                            onChange={(e: any, newValue: any) =>
                                                onChange("currency", newValue)
                                            }
                                        >
                                            {useCurrencies.map(
                                                (c: any, index: number) => (
                                                    <Option
                                                        value={c.id}
                                                        key={index}
                                                    >
                                                        {c.name}
                                                    </Option>
                                                ),
                                            )}
                                        </Select>
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
                                                {useSheet.map(
                                                    (
                                                        employee: any,
                                                        index: number,
                                                    ) => (
                                                        <tr
                                                            key={index}
                                                            onClick={() => {
                                                                setModalState({
                                                                    state: true,
                                                                    index,
                                                                    overtime:
                                                                        employee.overtime,
                                                                    obsence:
                                                                        employee.absence,
                                                                    tax: employee.tax,
                                                                    net_salary:
                                                                        employee.net_salary,
                                                                });
                                                            }}
                                                        >
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                {employee.name}
                                                            </td>
                                                            <td>
                                                                {employee.code}
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.branch
                                                                }
                                                            </td>
                                                            <td>
                                                                {employee.job}
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.salary
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.presense
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.absence
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.overtime
                                                                }
                                                            </td>
                                                            <td>
                                                                {employee.tax}
                                                            </td>
                                                            <td>
                                                                {
                                                                    employee.net_salary
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
                        <CardActions>
                            <Textarea
                                onChange={(
                                    e: ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        remarks: e.target.value,
                                    }))
                                }
                                placeholder="تفصیل"
                                sx={{ width: "100% " }}
                            ></Textarea>
                            <Button
                                fullWidth
                                onClick={() => onSubmit()}
                                loading={useFormData.loading}
                            >
                                ثبت
                            </Button>
                        </CardActions>
                    </Card>
                </DialogContent>

                <PayrollEditModal
                    modalProps={modelState}
                    setOpen={closeDialog}
                    onChange={function (field: string, value: any): void {
                        setModalState((prev) => ({
                            ...prev,
                            [field]: value,
                        }));
                    }}
                />
            </ModalDialog>
        </Modal>
    );
}

export default AddPayroll;
