import { getNonProcessedVisas } from "@/Utils/FetchResources";
import Search from "@mui/icons-material/Search";
import {
    Card,
    CardContent,
    Checkbox,
    Grid,
    Input,
    Sheet,
    Typography,
} from "@mui/joy";
import { Table } from "@mui/joy";
import { Divider } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useEventEmitter } from "../ProcessVisa";

interface IVisa {
    visa_no: number;
    name: string;
    customer: {
        id: number;
        name: string;
    };
    type: {
        id: number;
        name: string;
    };
    created_at: string;
    passport_no: string;
    branch: {
        id: number;
        name: string;
    };
    isSelected: boolean;
}

function ProcessVisaPendingSection() {
    const [usePendingVisas, setPendingVisas] = useState<IVisa[]>([]);
    const [selected, setSelected] = useState<readonly IVisa[]>([]);
    const [filter, setFilter] = useState<string>("");
    const { emitEvent } = useEventEmitter();

    const SendVisaToProcessing = (visas: IVisa[]) => {
        emitEvent("onVisaSelect", visas);
    };

    const LoadResource = () => {
        getNonProcessedVisas((visa: Array<object>) => {
            setPendingVisas(visa as IVisa[]);
        });
    };

    useEffect(() => {
        LoadResource();

        addEventListener("reloadPendingVisas", LoadResource);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener("reloadPendingVisas", LoadResource);
        };
    }, []);

    const isSelected = (visa: IVisa): boolean => {
        return (
            selected.findIndex((v: IVisa) => v.visa_no == visa.visa_no) !== -1
        );
    };

    const handleClick = (event: React.MouseEvent<unknown>, visa: IVisa) => {
        const selectedIndex = selected.findIndex(
            (v: IVisa) => v.visa_no == visa.visa_no,
        );
        let newSelected: readonly IVisa[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, visa);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
        SendVisaToProcessing(newSelected as IVisa[]);
    };

    // const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         const newSelected = [...usePendingVisas];
    //         setSelected(newSelected);
    //         return;
    //     }
    //     setSelected([]);
    // };
    return (
        <Grid xl={6} sm={12} md={6}>
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
                            معطلو ویزو انتخاب
                        </Typography>
                        <div>
                            <Input
                                startDecorator={<Search />}
                                placeholder="ویزو پلټنه"
                                size="sm"
                                value={filter}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFilter(e.target.value as string)
                                }
                            />
                        </div>
                    </Sheet>

                    <Sheet
                        sx={{
                            height: "70dvh",
                            overflowY: "auto",
                            overflowX: "hidden",
                            mb: 2,
                        }}
                    >
                        <Table
                            variant="soft"
                            size="sm"
                            hoverRow
                            stickyHeader
                            sx={{
                                "& tr > th": {
                                    textAlign: "right",
                                },
                                "--TableCell-selectedBackground": (theme) =>
                                    theme.vars.palette.success.softBg,
                                tableLayout: "auto",
                            }}
                        >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>تاریخ</th>
                                    <th>پاسپورټ</th>
                                    <th>نام و تخلص</th>
                                    <th>مربوط</th>
                                    <th>نوع ویزا</th>
                                    <th>څانګه</th>
                                    <th>
                                        <Checkbox
                                            indeterminate={
                                                selected.length > 0 &&
                                                selected.length <
                                                    usePendingVisas.length
                                            }
                                            checked={
                                                usePendingVisas.length > 0 &&
                                                selected.length ===
                                                    usePendingVisas.length
                                            }
                                            //      onChange={handleSelectAllClick}
                                            slotProps={{
                                                input: {
                                                    "aria-label":
                                                        "select all visas",
                                                },
                                            }}
                                            sx={{ verticalAlign: "sub" }}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {usePendingVisas
                                    .filter(
                                        (v) =>
                                            v.visa_no
                                                .toString()
                                                .indexOf(
                                                    filter.toLowerCase(),
                                                ) !== -1 ||
                                            v.passport_no
                                                .toLowerCase()
                                                .indexOf(
                                                    filter.toLowerCase(),
                                                ) !== -1 ||
                                            (v.name || "")
                                                .toLowerCase()
                                                .indexOf(
                                                    filter.toLowerCase(),
                                                ) !== -1,
                                    )
                                    .map((visa: IVisa, index: number) => {
                                        const isItemSelected = isSelected(visa);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <tr
                                                key={index}
                                                onClick={(event) =>
                                                    handleClick(event, visa)
                                                }
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                // selected={isItemSelected}
                                                style={
                                                    isItemSelected
                                                        ? ({
                                                              "--TableCell-dataBackground":
                                                                  "var(--TableCell-selectedBackground)",
                                                              "--TableCell-headBackground":
                                                                  "var(--TableCell-selectedBackground)",
                                                          } as React.CSSProperties)
                                                        : {}
                                                }
                                            >
                                                <td>{visa.visa_no}</td>
                                                <td>
                                                    {visa.created_at.substring(
                                                        0,
                                                        10,
                                                    )}
                                                </td>
                                                <td>{visa.passport_no}</td>
                                                <td>{visa.name}</td>
                                                <td>{visa.customer.name}</td>
                                                <td>{visa.type.name}</td>
                                                <td>{visa.branch.name}</td>
                                                <td>
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        slotProps={{
                                                            input: {
                                                                "aria-labelledby":
                                                                    labelId,
                                                            },
                                                        }}
                                                        sx={{
                                                            verticalAlign:
                                                                "top",
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </Table>
                    </Sheet>
                    <Divider />
                    <Typography level="body-sm" fontWeight={"bolder"}>
                        جمله ویزي: {usePendingVisas.length}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default ProcessVisaPendingSection;
