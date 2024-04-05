import {
    Box,
    Button,
    ButtonGroup,
    Card,
    FormControl,
    IconButton,
    Option,
    Select,
    SelectStaticProps,
    Sheet,
    Typography,
} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { LoadCurrencies, GetTills } from "@/Utils/FetchResources";
import Print from "@mui/icons-material/Print";
import { DatePicker } from "zaman";
import { getJournalBalancies } from "@/Utils/FetchReports";

interface IProps {
    useFilter: {
        transactionType: string;
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
        till: null | number;
    };
    onChange(newValue: any, fieldName: string): void;
    onSearch(): void;
    useLoader: boolean;
    onPrint(): void;
    usePrintLoader: boolean;
}

function JournalReportFilter({
    useFilter,
    onChange,
    onSearch,
    useLoader,
    onPrint,
    usePrintLoader,
}: IProps) {
    const [useCurrencies, setCurrencies] = useState<Array<object>>([]);
    const [useTills, setTill] = useState<Array<object>>([]);
    const [useBalancies, setBalancies] = useState<{
        old_balancies: Array<any>;
        current_balancies: Array<any>;
    }>({
        old_balancies: [],
        current_balancies: [],
    });
    const action: SelectStaticProps["action"] = useRef(null);
    const StartDateRef = useRef(null);
    const EndDateRef = useRef(null);

    const loadResources = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies);
            const old_balancies: Array<any> = [];
            const current_balancies: Array<any> = [];

            currencies.forEach((c: any) => {
                old_balancies.push({
                    id: c.id,
                    symbol: c.symbol,
                    balance: 0,
                    credit: 0,
                    debit: 0,
                });
                current_balancies.push({
                    id: c.id,
                    symbol: c.symbol,
                    balance: 0,
                    credit: 0,
                    debit: 0,
                });
            });

            setBalancies({
                old_balancies: old_balancies,
                current_balancies: current_balancies,
            });
        });

        GetTills(function (tills: Array<any>): void {
            setTill(tills);
            // setBalancies((p)=>({
            //     ...p,
            //     current_balancies: p.current_balancies.map((pb:any)=>({

            //     }))
            // }))
        });

        getJournalBalancies(function ($balancies: Array<any>): void {});
    };

    useEffect(() => {
        const Sinput = (StartDateRef?.current as any)?.getElementsByTagName(
            "input",
        );
        const Einput = (EndDateRef?.current as any)?.getElementsByTagName(
            "input",
        );
        if (Sinput && Einput) {
            (Sinput[0] as HTMLInputElement).classList.add(
                ..."MuiInput-input css-1pqn8v6-JoyInput-input".split(" "),
            );
            (Sinput[0] as HTMLInputElement).style.fontWeight = "bolder";
            (Einput[0] as HTMLInputElement).classList.add(
                ..."MuiInput-input css-1pqn8v6-JoyInput-input".split(" "),
            );
            (Einput[0] as HTMLInputElement).style.fontWeight = "bolder";
            (Einput[0] as HTMLInputElement).setAttribute(
                "placeholder",
                "خنم نیټه",
            );
            (Sinput[0] as HTMLInputElement).setAttribute(
                "placeholder",
                "شروع نیټه",
            );
        }
        loadResources();
    }, []);

    return (
        <>
            <Sheet
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <Card
                    sx={{
                        width: "50dvh",
                        borderWidth: 0,
                        pt: 0,
                    }}
                >
                    <Typography fontSize="sm" fontWeight="lg">
                        زړه موجودي
                    </Typography>

                    <Sheet
                        sx={{
                            bgcolor: "background.level1",
                            borderRadius: "sm",
                            p: 1,
                            display: "flex",
                            gap: 2,
                            "& > div": { flex: 1 },
                        }}
                    >
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                مبلغ
                            </Typography>
                            {useBalancies.old_balancies.map((b: any) => (
                                <Typography key={b.id} fontWeight="lg">
                                    {new Intl.NumberFormat("en").format(
                                        b.balance,
                                    )}{" "}
                                    {b.symbol}
                                </Typography>
                            ))}
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                رسیدګي
                            </Typography>
                            <Typography fontWeight="lg">980 ؋</Typography>
                            <Typography fontWeight="lg">980 ؋</Typography>
                            <Typography fontWeight="lg">980 ؋</Typography>
                            <Typography fontWeight="lg">980 ؋</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                بردګي
                            </Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                        </div>
                    </Sheet>
                </Card>
                <Card
                    sx={{
                        width: "50dvh",
                        borderWidth: 0,
                        pt: 0,
                    }}
                >
                    <Typography fontSize="sm" fontWeight="lg">
                        اوسني موجودي
                    </Typography>

                    <Sheet
                        sx={{
                            bgcolor: "background.level1",
                            borderRadius: "sm",
                            p: 1,
                            display: "flex",
                            gap: 2,
                            "& > div": { flex: 1 },
                        }}
                    >
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                مبلغ
                            </Typography>
                            <Typography fontWeight="lg">34</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                رسیدګي
                            </Typography>
                            <Typography fontWeight="lg">980</Typography>
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                بردګي
                            </Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                            <Typography fontWeight="lg">8.9</Typography>
                        </div>
                    </Sheet>
                </Card>
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: "sm",
                    display: { xs: "none", sm: "flex" },
                    alignItems: "flex-end",
                    gap: 1.5,
                    "& > *": {
                        width: "160px",
                    },
                }}
            >
                <div className="MuiFormControl-sizeSm">
                    <div
                        ref={StartDateRef}
                        className="MuiInput-root MuiInput-variantOutlined MuiInput-colorNeutral MuiInput-sizeSm MuiInput-formControl css-1559aiv-JoyInput-root"
                    >
                        <DatePicker
                            className="datePicker MuiInput-input css-1pqn8v6-JoyInput-input"
                            round="x4"
                            position="center"
                            onChange={(e: any) => {
                                console.log(e);
                                onChange(
                                    e?.value
                                        .toLocaleDateString("en-ZA")
                                        .replaceAll("/", "-"),
                                    "start_date",
                                );
                            }}
                        />
                    </div>
                </div>

                <div className="MuiFormControl-sizeSm">
                    <div
                        ref={EndDateRef}
                        className="MuiInput-root MuiInput-variantOutlined MuiInput-colorNeutral MuiInput-sizeSm MuiInput-formControl css-1559aiv-JoyInput-root"
                    >
                        <DatePicker
                            className="datePicker MuiInput-input css-1pqn8v6-JoyInput-input"
                            round="x4"
                            position="center"
                            onChange={(e: any) =>
                                onChange(
                                    e?.value
                                        .toLocaleDateString("en-ZA")
                                        .replaceAll("/", "-"),
                                    "end_date",
                                )
                            }
                        />
                    </div>
                </div>
                <FormControl size="sm">
                    <Select
                        {...(useFilter.transactionType && {
                            // display the button and remove select indicator
                            // when user has selected a value
                            endDecorator: (
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    sx={{
                                        "--IconButton-size": "22px",
                                    }}
                                    color="neutral"
                                    onMouseDown={(event) => {
                                        // don't open the popup when clicking on this button
                                        event.stopPropagation();
                                    }}
                                    onClick={() => {
                                        onChange(null, "transactionType");
                                        action.current?.focusVisible();
                                    }}
                                >
                                    <CloseRounded />
                                </IconButton>
                            ),
                            indicator: null,
                        })}
                        size="sm"
                        placeholder="معاملي ډول"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        value={useFilter.transactionType}
                        onChange={(e: any, newValue: any | null) =>
                            onChange(newValue, "transactionType")
                        }
                    >
                        <Option value="customer">مشتري </Option>
                        <Option value="employee">کارمند</Option>
                        <Option value="bank">بانک / صرافي</Option>
                        <Option value="till">دخل</Option>
                        <Option value="income">عاید</Option>
                        <Option value="expense">مصرف</Option>
                        <Option value="extra">متفرقه</Option>
                        <Option value="visa">ویزي</Option>
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <Select
                        size="sm"
                        slotProps={{
                            button: { sx: { whiteSpace: "nowrap" } },
                        }}
                        value={useFilter.currency}
                        multiple
                        placeholder="اسعار انتخاب"
                        onChange={(e: any, newValue: any | null) =>
                            onChange(newValue, "currency")
                        }
                    >
                        {useCurrencies.map((currency: any, index: number) => (
                            <Option value={currency.id} key={index}>
                                {currency.name}
                            </Option>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="sm">
                    <Select
                        size="sm"
                        placeholder=" څانګه انتخاب"
                        slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                        value={useFilter.till}
                        onChange={(e: any, newValue: any | null) =>
                            onChange(newValue, "till")
                        }
                    >
                        {useTills.map((till: any, index: number) => (
                            <Option value={till.id} key={index}>
                                {till.name}
                            </Option>
                        ))}
                    </Select>
                </FormControl>

                <div style={{ width: "fit-content" }} dir="ltr">
                    <ButtonGroup>
                        <Button
                            loading={usePrintLoader}
                            variant="outlined"
                            size="sm"
                            onClick={() => onPrint()}
                        >
                            {" "}
                            چاپ <Print />
                        </Button>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => onSearch()}
                            loading={useLoader}
                        >
                            پلټنه <SearchIcon />
                        </Button>
                    </ButtonGroup>
                </div>
            </Box>
        </>
    );
}

export default JournalReportFilter;
