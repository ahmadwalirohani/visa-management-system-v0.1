import {
    GetCustomersAsItems,
    GetVisaTypes,
    LoadCurrencies,
} from "@/Utils/FetchResources";
import { Head } from "@inertiajs/react";
import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    ColorPaletteProp,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Option,
    Select,
    Snackbar,
    Table,
    ToggleButtonGroup,
} from "@mui/joy";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { SendActionRequest } from "@/Utils/helpers";
import axios, { AxiosError } from "axios";

interface IVisaProps {
    customer: number | null;
    province: string | null;
    job: string | null;
    passport_no: string | null;
    block_no: string | null;
    currency: number;
    price: number;
}

interface ICurrency {
    id: number;
    name: string;
}

function AddVisa() {
    const [useVisaForm, setVisaForm] = useState({
        basic_type: "normal",
        visa_qty: 1,
        visa_type: 0,
        visa_entrance_type: 0,
        loading: false,
    });
    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });
    const [useCurrencies, setCurrencies] = useState<ICurrency[]>([]);
    const [useCustomers, setCustomers] = useState<Array<object>>([]);
    const [useVisaTypes, setVisaTypes] = useState<Array<object>>([]);
    const [useVisaEntranceTypes, setEntranceType] = useState<Array<object>>([]);
    const [useVisaList, setVisaList] = useState<IVisaProps[]>([]);

    const fetchVisaTypes = () => {
        GetVisaTypes(function (types: Array<object>): void {
            setVisaTypes(types);
        });
    };

    const fetchCustomers = () => {
        GetCustomersAsItems(function (customers: Array<object>): void {
            setCustomers(customers);
        });
    };

    const fetchCurrencies = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies as ICurrency[]);
            setVisaList([
                {
                    customer: null,
                    province: "",
                    job: "",
                    passport_no: "",
                    block_no: "پ:",
                    currency:
                        (currencies as ICurrency[]).filter(
                            (c: any) => c.is_default == 1,
                        )[0]?.id || 0,
                    price: 0,
                },
            ]);
        });
    };

    const removeVisa = (e: any, index: number) => {
        const NewVisa = [...useVisaList.filter((_, i) => i !== index)];
        setVisaList(NewVisa);
    };

    const handleInputChange = (
        newValue: any,
        index: number,
        field: string,
    ): void => {
        const cVisaList = [...useVisaList];
        let province = {};
        if (field == "customer") province = { province: newValue.province };
        cVisaList[index] = {
            ...cVisaList[index],
            [field]: newValue,
            ...province,
        };

        setVisaList(cVisaList);
    };

    useEffect(() => {
        fetchCustomers();
        fetchVisaTypes();
        fetchCurrencies();
    }, []);

    const onSubmit = () => {
        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "create_new_visas",
                _validation_class: "CreateVisa",
            },
            Object.assign(useVisaForm, { visasList: [...useVisaList] }),
        );

        setVisaForm((prevState) => ({
            ...prevState,
            loading: true,
        }));

        axios
            .post(Config.url, Config.payload)
            .then((): void => {
                setSnackbar({
                    msg: "ویزي په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });

                resetAll();
            })
            .catch((Error: AxiosError<any>): void => {
                setSnackbar({
                    msg: Error.response?.data.message,
                    state: "danger",
                    is_open: true,
                });
            })
            .finally(() =>
                setVisaForm((prevState) => ({
                    ...prevState,
                    loading: false,
                })),
            );
    };

    const resetAll = (): void => {
        setVisaForm({
            basic_type: "normal",
            visa_qty: 1,
            visa_type: 0,
            visa_entrance_type: 0,
            loading: false,
        });

        setVisaList([
            {
                customer: null,
                province: "",
                job: "",
                passport_no: "",
                block_no: "پ:",
                currency:
                    useCurrencies.filter((c: any) => c.is_default == 1)[0]
                        ?.id || 0,
                price: 0,
            },
        ]);
    };
    return (
        <>
            <Head title="ویزي ثبت" />
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
                <Card sx={{ flex: 1, width: "100%" }}>
                    <Box
                        sx={{
                            position: "sticky",
                            top: { md: 5 },
                            bgcolor: "background.body",
                        }}
                    >
                        <Box
                            sx={{
                                height: "85dvh",
                                overflow: "auto",
                            }}
                        >
                            <Grid
                                container
                                spacing={0}
                                sx={{
                                    alignItems: "flex-end",
                                }}
                            >
                                <Grid md={3}>
                                    <ToggleButtonGroup
                                        variant="soft"
                                        color="primary"
                                        size="lg"
                                        spacing={{ md: 2 }}
                                        value={useVisaForm.basic_type}
                                        onChange={(e, newValue) => {
                                            setVisaForm((prevState) => ({
                                                ...prevState,
                                                basic_type: newValue as string,
                                            }));
                                        }}
                                    >
                                        <Button value="normal" fullWidth>
                                            عادي
                                        </Button>
                                        <Button value="urgent" fullWidth>
                                            فوري
                                        </Button>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid md={2} sx={{ mr: 3 }}>
                                    <FormControl>
                                        <FormLabel>ویزي ډول</FormLabel>
                                        <Select
                                            value={useVisaForm.visa_type}
                                            onChange={(e, newValue) => {
                                                setEntranceType(
                                                    (
                                                        useVisaTypes.filter(
                                                            (t: any) =>
                                                                t.id ==
                                                                newValue,
                                                        )[0] as any
                                                    )?.entrance_types || [],
                                                );
                                                setVisaForm((prevState) => ({
                                                    ...prevState,
                                                    visa_type:
                                                        newValue as number,
                                                }));
                                            }}
                                        >
                                            {useVisaTypes.map(
                                                (type: any, i: number) => (
                                                    <Option
                                                        key={i}
                                                        value={type.id}
                                                    >
                                                        {type.name}
                                                    </Option>
                                                ),
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid md={2} sx={{ mr: 3 }}>
                                    <FormControl>
                                        <FormLabel>ویزي نوعیت دخول</FormLabel>
                                        <Select
                                            value={
                                                useVisaForm.visa_entrance_type
                                            }
                                            onChange={(e, newValue: any) => {
                                                setVisaForm((prevState) => ({
                                                    ...prevState,
                                                    visa_entrance_type:
                                                        newValue as number,
                                                }));
                                            }}
                                        >
                                            {useVisaEntranceTypes.map(
                                                (type: any, i: number) => (
                                                    <Option
                                                        key={i}
                                                        value={type}
                                                    >
                                                        {type.name}
                                                    </Option>
                                                ),
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid md={2} sx={{ mr: 3 }}>
                                    <FormControl>
                                        <FormLabel>ویزو تعداد</FormLabel>
                                        <Input
                                            value={useVisaForm.visa_qty}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                setVisaForm((prevState) => ({
                                                    ...prevState,
                                                    visa_qty: (
                                                        e.target as HTMLInputElement
                                                    ).value as any,
                                                }));
                                            }}
                                            type="number"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid
                                    md={12}
                                    sx={{
                                        mt: 5,
                                    }}
                                >
                                    <Card
                                        sx={{
                                            height: "72dvh",
                                        }}
                                    >
                                        <CardContent>
                                            <Table
                                                sx={{
                                                    "& tr > th": {
                                                        textAlign: "right",
                                                    },
                                                    tableLayout: "auto",
                                                }}
                                                size="sm"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>#</th>
                                                        <th>شرکت</th>
                                                        <th>ولایت</th>
                                                        <th>وظیفي عنوان</th>
                                                        <th>شماره پاسپورټ</th>
                                                        <th>نمبر پلیټ</th>
                                                        <th>اسعار</th>
                                                        <th>قیمت</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {useVisaList.map(
                                                        (
                                                            visa: IVisaProps,
                                                            i: number,
                                                        ) => (
                                                            <tr key={i}>
                                                                <td>
                                                                    <ButtonGroup
                                                                        dir="ltr"
                                                                        size="sm"
                                                                    >
                                                                        <Button
                                                                            disabled={
                                                                                useVisaList.length ==
                                                                                1
                                                                            }
                                                                            onClick={(
                                                                                e,
                                                                            ) =>
                                                                                removeVisa(
                                                                                    e,
                                                                                    i,
                                                                                )
                                                                            }
                                                                        >
                                                                            <DeleteIcon />
                                                                        </Button>
                                                                        {i +
                                                                            1 ==
                                                                            useVisaList.length && (
                                                                            <Button
                                                                                onClick={() => {
                                                                                    setVisaList(
                                                                                        (
                                                                                            prevVisa,
                                                                                        ) => [
                                                                                            ...prevVisa,
                                                                                            {
                                                                                                customer:
                                                                                                    null,
                                                                                                province:
                                                                                                    "",
                                                                                                job: "",
                                                                                                passport_no:
                                                                                                    "",
                                                                                                block_no:
                                                                                                    "پ:",
                                                                                                currency:
                                                                                                    useCurrencies.filter(
                                                                                                        (
                                                                                                            c: any,
                                                                                                        ) =>
                                                                                                            c.is_default ==
                                                                                                            1,
                                                                                                    )[0]
                                                                                                        ?.id ||
                                                                                                    0,
                                                                                                price: 0,
                                                                                            },
                                                                                        ],
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <AddCircleIcon />
                                                                            </Button>
                                                                        )}
                                                                    </ButtonGroup>
                                                                </td>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <Autocomplete
                                                                        sx={{
                                                                            width: 270,
                                                                        }}
                                                                        placeholder="شرکت"
                                                                        size="sm"
                                                                        options={
                                                                            useCustomers
                                                                        }
                                                                        getOptionLabel={(
                                                                            option: any,
                                                                        ) =>
                                                                            option.name
                                                                        }
                                                                        getOptionKey={(
                                                                            option: any,
                                                                        ) =>
                                                                            option.id
                                                                        }
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .customer
                                                                        }
                                                                        onChange={(
                                                                            e: SyntheticEvent | null,
                                                                            newValue: any,
                                                                        ) => {
                                                                            handleInputChange(
                                                                                newValue,
                                                                                i,
                                                                                "customer",
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        sx={{
                                                                            width: 150,
                                                                        }}
                                                                        placeholder="ولایت"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .province as string
                                                                        }
                                                                        onChange={(
                                                                            e: ChangeEvent<HTMLInputElement>,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                (
                                                                                    e.target as HTMLInputElement
                                                                                )
                                                                                    .value,
                                                                                i,
                                                                                "province",
                                                                            )
                                                                        }
                                                                        size="sm"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        size="sm"
                                                                        sx={{
                                                                            width: 120,
                                                                        }}
                                                                        placeholder="وظیفه"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .job as string
                                                                        }
                                                                        onChange={(
                                                                            e: ChangeEvent<HTMLInputElement>,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                (
                                                                                    e.target as HTMLInputElement
                                                                                )
                                                                                    .value,
                                                                                i,
                                                                                "job",
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        size="sm"
                                                                        sx={{
                                                                            width: 170,
                                                                        }}
                                                                        placeholder="پاسپورټ"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .passport_no as string
                                                                        }
                                                                        onChange={(
                                                                            e: ChangeEvent<HTMLInputElement>,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                (
                                                                                    e.target as HTMLInputElement
                                                                                )
                                                                                    .value,
                                                                                i,
                                                                                "passport_no",
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        size="sm"
                                                                        sx={{
                                                                            width: 160,
                                                                        }}
                                                                        placeholder="پلیټ"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .block_no as string
                                                                        }
                                                                        onChange={(
                                                                            e: ChangeEvent<HTMLInputElement>,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                (
                                                                                    e.target as HTMLInputElement
                                                                                )
                                                                                    .value,
                                                                                i,
                                                                                "block_no",
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <Select
                                                                        size="sm"
                                                                        sx={{
                                                                            width: 120,
                                                                        }}
                                                                        placeholder="اسعار"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .currency
                                                                        }
                                                                        onChange={(
                                                                            e: SyntheticEvent | null,
                                                                            newValue,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                newValue,
                                                                                i,
                                                                                "currency",
                                                                            )
                                                                        }
                                                                    >
                                                                        {useCurrencies.map(
                                                                            (
                                                                                currency: any,
                                                                                index: number,
                                                                            ) => (
                                                                                <Option
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    value={
                                                                                        currency.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        currency.name
                                                                                    }
                                                                                </Option>
                                                                            ),
                                                                        )}
                                                                    </Select>
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        size="sm"
                                                                        sx={{
                                                                            width: 120,
                                                                        }}
                                                                        type="number"
                                                                        placeholder="قیمت"
                                                                        value={
                                                                            useVisaList[
                                                                                i
                                                                            ]
                                                                                .price
                                                                        }
                                                                        onChange={(
                                                                            e: ChangeEvent<HTMLInputElement>,
                                                                        ) =>
                                                                            handleInputChange(
                                                                                (
                                                                                    e.target as HTMLInputElement
                                                                                )
                                                                                    .value,
                                                                                i,
                                                                                "price",
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </Table>
                                        </CardContent>
                                        <CardActions buttonFlex="0 1 120px">
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                disabled={
                                                    useVisaList.some(
                                                        (v) =>
                                                            v.customer ==
                                                                null ||
                                                            !v.passport_no ||
                                                            !v.province,
                                                    ) ||
                                                    !useVisaForm.basic_type ||
                                                    !useVisaForm.visa_type ||
                                                    !useVisaForm.visa_entrance_type
                                                }
                                                loading={useVisaForm.loading}
                                                onClick={() => onSubmit()}
                                            >
                                                ثبت
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="neutral"
                                            >
                                                پاکول
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Card>
            </Box>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={3000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() =>
                    setSnackbar({
                        is_open: false,
                        state: "string",
                        msg: "",
                    })
                }
            >
                {useSnackbar.msg}
            </Snackbar>
        </>
    );
}

export default AddVisa;
