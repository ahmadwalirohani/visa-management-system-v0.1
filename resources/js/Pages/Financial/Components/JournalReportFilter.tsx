import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    IconButton,
    Option,
    Select,
    SelectStaticProps,
} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import { LoadBranches, LoadCurrencies } from "@/Utils/FetchResources";
import Print from "@mui/icons-material/Print";
import { DatePicker } from "zaman";

interface IProps {
    useFilter: {
        transactionType: string;
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
        branch: null | number;
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
    const [useBranches, setBranches] = useState<Array<object>>([]);
    const action: SelectStaticProps["action"] = useRef(null);
    const StartDateRef = useRef(null);
    const EndDateRef = useRef(null);

    const loadResources = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies);
        });

        LoadBranches(function (branches: Array<any>): void {
            setBranches(branches);
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
        }
        loadResources();
    }, []);

    return (
        <Box
            className="SearchAndFilters-tabletUp"
            sx={{
                borderRadius: "sm",
                py: 1,
                display: { xs: "none", sm: "flex" },
                alignItems: "flex-end",
                gap: 1.5,
                "& > *": {
                    width: "160px",
                },
            }}
        >
            <div className="MuiFormControl-sizeSm">
                <FormLabel> شروع نیټه</FormLabel>
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
                <FormLabel> پای نیټه</FormLabel>
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
                <FormLabel>معاملي ډول</FormLabel>
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
                    placeholder="Filter by transaction type"
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
                <FormLabel> اسعار انتخاب</FormLabel>
                <Select
                    size="sm"
                    slotProps={{
                        button: { sx: { whiteSpace: "nowrap" } },
                    }}
                    value={useFilter.currency}
                    multiple
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
                <FormLabel> څانګه انتخاب</FormLabel>
                <Select
                    size="sm"
                    slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                    value={useFilter.branch}
                    onChange={(e: any, newValue: any | null) =>
                        onChange(newValue, "branch")
                    }
                >
                    {useBranches.map((branch: any, index: number) => (
                        <Option value={branch.id} key={index}>
                            {branch.name}
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
    );
}

export default JournalReportFilter;
