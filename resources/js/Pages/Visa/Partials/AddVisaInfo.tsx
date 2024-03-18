import { IVisaProps } from "@/types";
import {
    Autocomplete,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Option,
    Select,
    Sheet,
    ToggleButtonGroup,
    Typography,
} from "@mui/joy";
import { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";

interface IFormProps {
    formData: IVisaProps;
    loading: boolean;
    onChange(newValue: any, field: string): void;
    customers: Array<object>;
    visa_types: Array<object>;
    currencies: Array<object>;
    onSubmit(): void;
}

function AddVisaInfo({
    formData,
    loading,
    onChange,
    visa_types,
    customers,
    currencies,
    onSubmit,
}: IFormProps) {
    const [useVisaEntranceTypes, setEntranceType] = useState<Array<object>>([]);

    return (
        <Grid xl={4} sm={12} md={4}>
            <form
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                <Card
                    sx={{
                        height: "85dvh",
                    }}
                >
                    <CardContent>
                        <Sheet
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography level="h4" sx={{ mb: 2 }}>
                                ویزي ثبت
                            </Typography>

                            <Input
                                size="sm"
                                placeholder="د ویزو تعداد"
                                sx={{ width: 100 }}
                                type="number"
                                value={formData.visa_qty}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    onChange(
                                        (e.target as HTMLInputElement)
                                            .value as string,
                                        "visa_qty",
                                    )
                                }
                            />
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
                                        onChange={(e: any, newValue: any) => {
                                            onChange(newValue, "visa_type");
                                            setEntranceType(
                                                (
                                                    visa_types.filter(
                                                        (t: any) =>
                                                            t.id == newValue,
                                                    )[0] as any
                                                )?.entrance_types || [],
                                            );
                                        }}
                                    >
                                        {visa_types.map(
                                            (type: any, i: number) => (
                                                <Option key={i} value={type.id}>
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
                                        options={customers}
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                        value={formData.currency}
                                        onChange={(e: any, newValue: any) =>
                                            onChange(newValue, "currency")
                                        }
                                    >
                                        {currencies.map(
                                            (type: any, i: number) => (
                                                <Option key={i} value={type.id}>
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
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
                                                (e.target as HTMLInputElement)
                                                    .value as string,
                                                "remarks",
                                            )
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions buttonFlex="0 0 125 1">
                        <Button type="submit" loading={loading} fullWidth>
                            ثبت
                        </Button>
                        <Button fullWidth variant="soft">
                            پاکول
                        </Button>
                    </CardActions>
                </Card>
            </form>
        </Grid>
    );
}

export default AddVisaInfo;
