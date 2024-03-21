import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Select,
    Sheet,
    Typography,
    Table,
} from "@mui/joy";
import { useEventEmitter } from "../ProcessVisa";
import { useEffect, useState } from "react";

interface IVisa {
    visa_no: number;
    id: number;
    price: number;
    residence: string;
    serial_no: string;
    profit: number;
    expense: number;
}

function ProcessVisaProcessingSection() {
    const { addEventListener } = useEventEmitter();
    const [useVisas, setVisas] = useState<IVisa[]>([]);

    const handleOnVisaSelectEvent = (visas: Array<any>) => {
        setVisas([
            ...visas.map(
                (visa: any) =>
                    ({
                        visa_no: visa.visa_no,
                        id: visa.id,
                        price: visa.price,
                        residence: "",
                        serial_no: "",
                        profit: 0,
                        expense: 0,
                    }) as IVisa,
            ),
        ]);
    };

    useEffect(() => {
        addEventListener("onVisaSelect", handleOnVisaSelectEvent);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener("onVisaSelect", handleOnVisaSelectEvent);
        };
    }, []);
    return (
        <Grid xl={6} sm={12} md={6}>
            <Card
                sx={{
                    height: "85dvh",
                }}
            >
                <CardContent>
                    <Typography level="h4" sx={{ mb: 2 }}>
                        معطلو ویزو جاري
                    </Typography>

                    <Sheet
                        sx={{
                            height: "50dvh",
                            overflow: "auto",
                            width: "100%",
                        }}
                    >
                        <Table
                            size="sm"
                            stickyHeader
                            stickyFooter
                            variant="soft"
                            hoverRow
                            sx={{
                                "& tr > *": {
                                    textAlign: "center",
                                    width: "fit-content",
                                },
                                tableLayout: "auto",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th style={{ width: 50 }}>لیبل</th>
                                    <th style={{ width: "100 px !important" }}>
                                        قیمت
                                    </th>
                                    <th>اقامت</th>
                                    <th>شماره سند</th>
                                    <th>مصارف</th>
                                    <th>مفاد</th>
                                </tr>
                            </thead>
                            <tbody>
                                {useVisas.map((visa: IVisa, index: number) => (
                                    <tr
                                        key={index}
                                        onDoubleClick={() => alert("asd")}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{visa.id}</td>
                                        <td>
                                            <Input
                                                sx={{ width: "110px" }}
                                                size="sm"
                                                type="number"
                                                value={visa.price}
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                sx={{ width: "110px" }}
                                                size="sm"
                                                type="text"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                sx={{ width: "110px" }}
                                                size="sm"
                                                type="text"
                                            />
                                        </td>
                                        <td>
                                            <Input
                                                sx={{ width: "110px" }}
                                                size="sm"
                                                type="number"
                                            />
                                        </td>
                                        <td>100.23 $</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Sheet>
                    <Table>
                        <tr>
                            <th></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                                <Typography fontWeight="bold" level="body-md">
                                    132
                                </Typography>
                            </td>
                            <td>
                                <Typography fontWeight="bold" level="body-md">
                                    132
                                </Typography>
                            </td>
                        </tr>
                    </Table>

                    <Box gap={2} display={"flex"}>
                        <Sheet
                            sx={{
                                width: "30%",
                            }}
                        >
                            <FormControl>
                                <FormLabel>دخل انتخاب</FormLabel>
                                <Select></Select>
                            </FormControl>
                        </Sheet>
                        <Sheet
                            sx={{
                                width: "70%",
                                height: "15dvh",
                                overflow: "auto",
                            }}
                        >
                            <Table
                                size="sm"
                                stickyFooter
                                stickyHeader
                                variant="outlined"
                                sx={{
                                    "& tr > *": {
                                        textAlign: "right",
                                    },
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>اسعار</th>
                                        <th>جمله مصارف</th>
                                        <th>دخل موجودي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">افغاني</th>
                                        <td>1123</td>
                                        <td>213</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">افغاني</th>
                                        <td>1123</td>
                                        <td>213</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">افغاني</th>
                                        <td>1123</td>
                                        <td>213</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">افغاني</th>
                                        <td>1123</td>
                                        <td>213</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Sheet>
                    </Box>
                </CardContent>
                <CardActions buttonFlex="0 0 125 1">
                    <Button type="submit" fullWidth>
                        ثبت
                    </Button>
                    <Button fullWidth variant="outlined">
                        چاپ
                    </Button>
                    <Button fullWidth variant="soft">
                        پاکول
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}

export default ProcessVisaProcessingSection;
