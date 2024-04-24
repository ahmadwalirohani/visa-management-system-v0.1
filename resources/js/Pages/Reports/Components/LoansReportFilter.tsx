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
import { SyntheticEvent, useEffect, useState } from "react";
import { LoadBranches } from "@/Utils/FetchResources";
import Print from "@mui/icons-material/Print";

interface IProps {
    useFilter: {
        branch: null | {
            id: number;
            name: string;
        };
        search: string;
        type: string;
        currency: Array<any>;
    };
    onChange(newValue: any, fieldName: string): void;
    onSearch(): void;
    useLoader: boolean;
    onPrint(): void;
    usePrintLoader: boolean;
    useCurrencies: Array<any>;
}

function LoansReportFilter({
    useFilter,
    onChange,
    onSearch,
    useLoader,
    onPrint,
    usePrintLoader,
    useCurrencies,
}: IProps) {
    const [useBranches, setBranches] = useState<Array<any>>([]);

    const loadResources = () => {
        LoadBranches(function (Branches: Array<any>) {
            setBranches(Branches);
        });
    };

    useEffect(() => {
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
            <ToggleButtonGroup
                dir="ltr"
                color="primary"
                value={useFilter.type}
                onChange={(e, newValue) => onChange(newValue, "type")}
                variant="soft"
            >
                <Button value="on_loans">پر موږ پورنه </Button>
                <Button value="off_loans">پر نورو پورنه </Button>
            </ToggleButtonGroup>

            <FormControl size="sm">
                <FormLabel>څانګه</FormLabel>
                <Autocomplete
                    size="sm"
                    options={useBranches}
                    getOptionLabel={(option: any) => option.name}
                    getOptionKey={(option: any) => option.id}
                    value={useFilter.branch}
                    onChange={(e: SyntheticEvent | null, newValue: any) => {
                        onChange(newValue, "branch");
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

export default LoansReportFilter;
