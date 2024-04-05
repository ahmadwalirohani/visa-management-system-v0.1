import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    Option,
    Select,
    ToggleButtonGroup,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { GetCustomersAsItems, LoadCurrencies } from "@/Utils/FetchResources";
import Print from "@mui/icons-material/Print";
import { DatePicker } from "zaman";

interface IProps {
    useFilter: {
        customer: null | {
            id: number;
            name: string;
            branch_id: number;
        };
        search: string;
        start_date: string;
        end_date: string;
        currency: Array<any>;
    };
    onChange(newValue: any, fieldName: string): void;
    onSearch(): void;
    useLoader: boolean;
    onPrint(): void;
    usePrintLoader: boolean;
}

function ProceedVisaReportFilter({
    useFilter,
    onChange,
    onSearch,
    useLoader,
    onPrint,
    usePrintLoader,
}: IProps) {
    const [useCurrencies, setCurrencies] = useState<Array<object>>([]);
    const [useCustomers, setCustomers] = useState<Array<any>>([]);
    const StartDateRef = useRef(null);
    const EndDateRef = useRef(null);

    const loadResources = () => {
        LoadCurrencies(function (currencies: Array<object>): void {
            setCurrencies(currencies);
        });

        GetCustomersAsItems(function (customers: Array<any>) {
            setCustomers(customers);
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
                    width: "260px",
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
                <FormLabel>مشتري</FormLabel>
                <Autocomplete
                    placeholder="شرکت"
                    size="sm"
                    options={useCustomers}
                    getOptionLabel={(option: any) => option.name}
                    getOptionKey={(option: any) => option.id}
                    value={useFilter.customer}
                    onChange={(e: SyntheticEvent | null, newValue: any) => {
                        onChange(newValue, "customer");
                    }}
                />
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

            <ToggleButtonGroup dir="ltr" color="primary" variant="soft">
                <Button>تصفیه </Button>
                <Button>نا تصفیه </Button>
                <Button>ټولي </Button>
            </ToggleButtonGroup>

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

export default ProceedVisaReportFilter;
