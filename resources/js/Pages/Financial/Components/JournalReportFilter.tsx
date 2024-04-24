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
import { getTillOpenCloseBalancies } from "@/Utils/FetchReports";

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
    const [useTills, setTill] = useState<
        Array<{
            id: number;
            name: string;
            balancies: Array<any>;
        }>
    >([]);
    const [useBalancies, setBalancies] = useState<
        Array<{
            till_id: number;
            symbol: string;
            name: string;
            opened_balance: number;
            credit_amount: number;
            debit_amount: number;
            current_balance: number;
            currency_id: number;
        }>
    >([]);
    const action: SelectStaticProps["action"] = useRef(null);
    const StartDateRef = useRef(null);
    const EndDateRef = useRef(null);

    const loadResources = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies);

            currencies.forEach((c: any) => {
                setBalancies((prev) => [
                    ...prev,
                    ...[
                        {
                            till_id: 0,
                            credit_amount: 0,
                            debit_amount: 0,
                            current_balance: 0,
                            opened_balance: 0,
                            symbol: c.symbol,
                            name: c.name,
                            currency_id: c.id,
                        },
                    ],
                ]);
            });
        });

        GetTills(function (tills: Array<any>): void {
            setTill(tills.filter((t: any) => t.is_open == 1));
        });
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

    useEffect(() => {
        getTillOpenCloseBalancies(
            useFilter.till as number,
            function (balancies: Array<any>): void {
                const _balancies = [...useBalancies];
                _balancies.forEach((b) => {
                    // find index of fetched balancies array to match with exact currency
                    const iOfRetrivedBalance = (
                        balancies as any
                    ).balancies.findIndex(
                        (fb: any) => fb.currency_id == b.currency_id,
                    );
                    if (iOfRetrivedBalance !== -1) {
                        b.credit_amount = (balancies as any).balancies[
                            iOfRetrivedBalance
                        ].credit_amount;
                        b.debit_amount = (balancies as any).balancies[
                            iOfRetrivedBalance
                        ].debit_amount;
                        b.opened_balance = (balancies as any).balancies[
                            iOfRetrivedBalance
                        ].opened_balance;
                    }

                    b.current_balance = useTills
                        .filter((t: any) => t.id == useFilter.till)[0]
                        ?.balancies.filter(
                            (tb: any) => tb.currency_id == b.currency_id,
                        )[0]?.balance;
                });

                setBalancies(_balancies);
            },
        );
    }, [useFilter.till]);

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
                        width: "60dvh",
                        borderWidth: 0,
                        pt: 0,
                    }}
                >
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
                                شروع بیلانس
                            </Typography>
                            {useBalancies.map((b, index: number) => (
                                <Typography key={index} fontWeight="lg">
                                    {new Intl.NumberFormat("en").format(
                                        b.opened_balance,
                                    )}{" "}
                                    {b.symbol}
                                </Typography>
                            ))}
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                رسیدګي
                            </Typography>
                            {useBalancies.map((b, index: number) => (
                                <Typography key={index} fontWeight="lg">
                                    {new Intl.NumberFormat("en").format(
                                        b.credit_amount,
                                    )}{" "}
                                    {b.symbol}
                                </Typography>
                            ))}
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                بردګي
                            </Typography>
                            {useBalancies.map((b, index: number) => (
                                <Typography key={index} fontWeight="lg">
                                    {new Intl.NumberFormat("en").format(
                                        b.debit_amount,
                                    )}{" "}
                                    {b.symbol}
                                </Typography>
                            ))}
                        </div>
                        <div>
                            <Typography level="body-xs" fontWeight="lg">
                                اوسني بیلانس
                            </Typography>
                            {useBalancies.map((b, index: number) => (
                                <Typography key={index} fontWeight="lg">
                                    {new Intl.NumberFormat("en").format(
                                        b.current_balance,
                                    )}{" "}
                                    {b.symbol}
                                </Typography>
                            ))}
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
                        placeholder=" دخل انتخاب"
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
