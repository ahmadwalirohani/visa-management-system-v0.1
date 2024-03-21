import {
    Autocomplete,
    Box,
    FormControl,
    FormLabel,
    Input,
    Option,
    Select,
} from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
    GetCustomersAsItems,
    GetVisaTypes,
    LoadBranches,
} from "@/Utils/FetchResources";
import { IVisaPendingFilterProps } from "@/types";

interface IProps {
    useFilter: IVisaPendingFilterProps;
    onChange(newValue: any, fieldName: string): void;
}

function PendingVisaFilter({ useFilter, onChange }: IProps) {
    const [useCustomers, setCustomers] = useState<Array<object>>([]);
    const [useVisaTypes, setTypes] = useState<Array<object>>([]);
    const [useBranches, setBranches] = useState<Array<object>>([]);

    const loadResources = () => {
        GetCustomersAsItems(function (customer: Array<object>): void {
            setCustomers(customer);
        });

        GetVisaTypes(function (types: Array<object>): void {
            setTypes(types);
        });

        LoadBranches(function (branches: Array<object>): void {
            setBranches(branches);
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
                py: 2,
                display: { xs: "none", sm: "flex" },
                flexWrap: "wrap",
                gap: 1.5,
                "& > *": {
                    minWidth: { xs: "100px", md: "200px" },
                },
            }}
        >
            <FormControl sx={{ flex: 1 }} size="sm">
                <FormLabel>ویزي پلټنه</FormLabel>
                <Input
                    size="sm"
                    value={useFilter.search as string}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.value, "search")
                    }
                    startDecorator={<SearchIcon />}
                />
            </FormControl>

            <FormControl size="sm">
                <FormLabel>حالت</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
                    value={useFilter.status}
                    onChange={(e: any, newValue: any | null) =>
                        onChange(newValue, "status")
                    }
                >
                    <Option value="registration">معطلي</Option>
                    <Option value="booked">ثبت نام شد</Option>
                    <Option value="ordered">دستور</Option>
                    <Option value="cancelled">لغوه</Option>
                </Select>
            </FormControl>
            <FormControl size="sm">
                <FormLabel>څانګه</FormLabel>
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
            <FormControl size="sm">
                <FormLabel>نوع ویزه</FormLabel>
                <Select
                    size="sm"
                    value={useFilter.type}
                    onChange={(e: any, newValue: any | null) =>
                        onChange(newValue, "type")
                    }
                >
                    {useVisaTypes.map((type: any, i: number) => (
                        <Option key={i} value={type.id}>
                            {type.name}
                        </Option>
                    ))}
                </Select>
            </FormControl>
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
        </Box>
    );
}

export default PendingVisaFilter;
