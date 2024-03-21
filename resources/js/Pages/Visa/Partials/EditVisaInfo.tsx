import {
    GetCustomersAsItems,
    GetVisaTypes,
    LoadCurrencies,
} from "@/Utils/FetchResources";
import { IVisaProps } from "@/types";
import {
    DialogContent,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    ModalDialogProps,
    Option,
    Select,
    FormControl,
    FormLabel,
    Grid,
    Sheet,
    Typography,
    ToggleButtonGroup,
    Button,
    Autocomplete,
} from "@mui/joy";
import { Divider } from "@mui/material";
import {
    ChangeEvent,
    FormEvent,
    SyntheticEvent,
    useEffect,
    useState,
} from "react";

interface IFormProps {
    formData: IVisaProps;
    loading: boolean;
    onChange(newValue: any, field: string): void;
    onSubmit(): void;
}
interface IModalProps extends IFormProps {
    setLayoutState(state: ModalDialogProps["layout"] | undefined): void;
    layout: undefined | any;
    loading: boolean;
}

interface ICurrency {
    id: number;
    name: string;
}

function EditVisaInfo({
    setLayoutState,
    layout,
    onChange,
    onSubmit,
    formData,
    loading,
}: IModalProps) {
    const [useCustomers, setCustomers] = useState<Array<object>>([]);
    const [useVisaTypes, setVisaTypes] = useState<Array<object>>([]);
    const [useCurrencies, setCurrencies] = useState<ICurrency[]>([]);
    const [useVisaEntranceTypes, setEntranceType] = useState<Array<object>>([]);

    const LoadResources = () => {
        GetCustomersAsItems(function (customers: Array<object>): void {
            setCustomers(customers);
        });
        GetVisaTypes(function (types: Array<object>): void {
            setVisaTypes(types);
        });
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies as ICurrency[]);
        });
    };

    useEffect(() => {
        if (
            useCurrencies.length == 0 ||
            useCustomers.length == 0 ||
            useVisaTypes.length == 0
        )
            LoadResources();

        setEntranceType(
            (
                useVisaTypes.filter(
                    (t: any) => t.id == formData.visa_type,
                )[0] as any
            )?.entrance_types || [],
        );
    }, [formData]);
    return (
        <>
            <Modal
                open={!!layout}
                onClose={() => {
                    setLayoutState(undefined);
                }}
                dir="rtl"
            >
                <ModalDialog dir="rtl" layout={layout}>
                    <ModalClose
                        sx={{
                            right: "inherit",
                            left: "var(--ModalClose-inset)",
                        }}
                    />

                    <DialogContent
                        sx={{
                            overflow: "hidden",
                            mt: 2,
                            minWidth: "600px",
                            maxWidth: "500px",
                        }}
                    >
                        <form
                            onSubmit={(e: FormEvent<HTMLFormElement>) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        >
                            <Sheet
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography level="h4" sx={{ mb: 2 }}>
                                    ویزي تغیر
                                </Typography>
                            </Sheet>

                            <Grid container spacing={1}>
                                <Grid md={12}>
                                    <ToggleButtonGroup
                                        variant="soft"
                                        color="primary"
                                        size="lg"
                                        spacing={{ md: 2 }}
                                        value={formData.basic_type}
                                        onChange={(e: any, newValue: any) =>
                                            onChange(newValue, "basic_type")
                                        }
                                    >
                                        <Button value="normal" fullWidth>
                                            عادي
                                        </Button>
                                        <Button value="urgent" fullWidth>
                                            فوري
                                        </Button>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>ویزي ډول</FormLabel>
                                        <Select
                                            size="sm"
                                            value={formData.visa_type}
                                            onChange={(
                                                e: any,
                                                newValue: any,
                                            ) => {
                                                onChange(newValue, "visa_type");
                                                setEntranceType(
                                                    (
                                                        useVisaTypes.filter(
                                                            (t: any) =>
                                                                t.id ==
                                                                newValue,
                                                        )[0] as any
                                                    )?.entrance_types || [],
                                                );
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
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>ویزي نوعیت دخول</FormLabel>
                                        <Autocomplete
                                            size="sm"
                                            options={useVisaEntranceTypes}
                                            getOptionLabel={(option: any) =>
                                                option.name
                                            }
                                            getOptionKey={(option: any) =>
                                                option.id
                                            }
                                            value={formData.visa_entrance_type}
                                            onChange={(
                                                e: SyntheticEvent | null,
                                                newValue: any,
                                            ) => {
                                                onChange(
                                                    newValue,
                                                    "visa_entrance_type",
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={12}>
                                    <Divider />
                                </Grid>
                                <Grid md={12}>
                                    <FormControl>
                                        <FormLabel>شرکت / مشتري</FormLabel>
                                        <Autocomplete
                                            placeholder="شرکت"
                                            size="sm"
                                            options={useCustomers}
                                            getOptionLabel={(option: any) =>
                                                option.name
                                            }
                                            getOptionKey={(option: any) =>
                                                option.id
                                            }
                                            value={formData.customer}
                                            onChange={(
                                                e: SyntheticEvent | null,
                                                newValue: any,
                                            ) => {
                                                onChange(newValue, "customer");
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>نوم / تخلص</FormLabel>
                                        <Input
                                            value={formData.name}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "name",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>پاسپورټ</FormLabel>
                                        <Input
                                            value={formData.passport_no}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "passport_no",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>اسعار</FormLabel>
                                        <Select
                                            value={formData.currency as number}
                                            onChange={(e: any, newValue: any) =>
                                                onChange(newValue, "currency")
                                            }
                                        >
                                            {useCurrencies.map(
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
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>قیمت</FormLabel>
                                        <Input
                                            type="number"
                                            value={formData.price}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "price",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>ولایت</FormLabel>
                                        <Input
                                            value={formData.province as string}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "province",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>وظیفه</FormLabel>
                                        <Input
                                            value={formData.job as string}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "job",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>پلیټ نمبر</FormLabel>
                                        <Input
                                            value={formData.block_no as string}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "block_no",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid md={6}>
                                    <FormControl>
                                        <FormLabel>تفصیل</FormLabel>
                                        <Input
                                            value={formData.remarks as string}
                                            onChange={(
                                                e: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                onChange(
                                                    (
                                                        e.target as HTMLInputElement
                                                    ).value as string,
                                                    "remarks",
                                                )
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Divider
                                sx={{
                                    mt: 2,
                                }}
                            />
                            <Sheet
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 3,
                                }}
                            >
                                <Button
                                    type="submit"
                                    loading={loading}
                                    fullWidth
                                >
                                    ثبت
                                </Button>
                                <Button fullWidth variant="soft">
                                    پاکول
                                </Button>
                            </Sheet>
                        </form>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default EditVisaInfo;
