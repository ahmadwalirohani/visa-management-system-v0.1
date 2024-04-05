import { getProcessedVisas } from "@/Utils/FetchResources";
import { SendActionRequest } from "@/Utils/helpers";
import Search from "@mui/icons-material/Search";
import {
    Card,
    CardContent,
    Checkbox,
    DialogContent,
    DialogTitle,
    Input,
    ModalDialog,
    Modal,
    Sheet,
    Button,
} from "@mui/joy";
import { Table } from "@mui/joy";
import axios, { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";

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
    price: number;
    paid_amount: number;
    branch: {
        id: number;
        name: string;
    };
    isSelected: boolean;
}

interface IProps {
    openState: boolean;
    setOpenState(state: boolean): void;
    selected: Array<any>;
    setSelected(visas: Array<any>): void;

    setSnackbar(state: any, is_open: boolean, msg: string): void;
}

function ViewVisaSelection({
    openState,
    setOpenState,
    selected,
    setSelected,
    setSnackbar,
}: IProps) {
    const [useProceedVisas, setProceedVisas] = useState<IVisa[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [useDiscount, setDiscount] = useState<number | null>(null);
    const [useRemarks, setRemarks] = useState<string>("");
    const [useLoader, setLoader] = useState<boolean>(false);

    const LoadResource = () => {
        getProcessedVisas((visa: Array<object>) => {
            setProceedVisas([...(visa as IVisa[])]);
        });
    };

    useEffect(() => {
        LoadResource();

        addEventListener("reloadProceedVisas", LoadResource);

        // Cleanup by removing the event listener when the component unmounts
        return () => {
            addEventListener("reloadProceedVisas", LoadResource);
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

        setSelected(newSelected as Array<any>);
    };

    // const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.checked) {
    //         const newSelected = [...useProceedVisas];
    //         setSelected(newSelected);
    //         return;
    //     }
    //     setSelected([]);
    // };
    const checkSameCustomerVisas = (customer_id: number): boolean => {
        if (selected.length == 0) return false;

        if (customer_id == selected[0].customer.id) return false;

        return true;
    };

    const onDiscountSubmit = () => {
        if (
            useDiscount &&
            useDiscount <= selected[0].price - selected[0].paid_amount
        ) {
            const Config = SendActionRequest(
                {
                    _class: "VisaLogics",
                    _method_name: "add_visa_discount",
                    _validation_class: null,
                },
                {
                    visa_id: selected[0].id,
                    customer_id: selected[0].customer_id,
                    currency_id: selected[0].currency_id,
                    discount_amount: useDiscount,
                    remarks: useRemarks,
                },
            );
            setLoader(true);
            axios
                .post(Config.url, Config.payload)
                .then(() => {
                    setSnackbar("success", true, "عملیه په بریالي سره ثبت سول");
                    LoadResource();
                    setDiscount(0);
                    setRemarks("");
                })
                .catch((Error: AxiosError<any>) => {
                    setSnackbar("danger", true, Error.response?.data.message);
                })
                .finally(() => setLoader(false));
        }
    };
    return (
        <Modal
            open={openState}
            onClose={() => {
                setOpenState(false);
            }}
        >
            <ModalDialog>
                <DialogTitle>جاري ویزي انتخاب</DialogTitle>
                <DialogContent
                    sx={{
                        width: "900px",
                        minHeight: "70dvh",
                        maxHeight: "70dvh",
                    }}
                >
                    <Card>
                        <CardContent>
                            <Sheet
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <Input
                                        startDecorator={<Search />}
                                        placeholder="ویزو پلټنه"
                                        size="sm"
                                        value={filter}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setFilter(e.target.value as string)
                                        }
                                    />
                                </div>

                                <div style={{ display: "flex" }}>
                                    <Input
                                        placeholder="تخفیف پر ویزه"
                                        type="number"
                                        size="sm"
                                        sx={{ ml: 5 }}
                                        value={useDiscount as any}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>,
                                        ) => setDiscount(e.target.value as any)}
                                    />
                                    <Input
                                        placeholder="  توضیحات"
                                        type="text"
                                        size="sm"
                                        value={useRemarks}
                                        sx={{ ml: 5 }}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>,
                                        ) => setRemarks(e.target.value as any)}
                                    />
                                    <Button
                                        size="sm"
                                        loading={useLoader}
                                        onClick={() => onDiscountSubmit()}
                                        disabled={
                                            selected.length > 1 ||
                                            selected.length == 0
                                        }
                                    >
                                        ثبت
                                    </Button>
                                </div>
                            </Sheet>

                            <Sheet
                                sx={{
                                    height: "58dvh",
                                    overflow: "auto",
                                    width: "100%",
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
                                        "--TableCell-selectedBackground": (
                                            theme,
                                        ) => theme.vars.palette.success.softBg,
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
                                            <th>قیمت</th>
                                            <th>باقي مبلغ</th>
                                            <th>
                                                <Checkbox
                                                    indeterminate={
                                                        selected.length > 0 &&
                                                        selected.length <
                                                            useProceedVisas.length
                                                    }
                                                    checked={
                                                        useProceedVisas.length >
                                                            0 &&
                                                        selected.length ===
                                                            useProceedVisas.length
                                                    }
                                                    //      onChange={handleSelectAllClick}
                                                    slotProps={{
                                                        input: {
                                                            "aria-label":
                                                                "select all visas",
                                                        },
                                                    }}
                                                    sx={{
                                                        verticalAlign: "sub",
                                                    }}
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {useProceedVisas
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
                                            .map(
                                                (
                                                    visa: IVisa,
                                                    index: number,
                                                ) => {
                                                    const isItemSelected =
                                                        isSelected(visa);
                                                    const labelId = `enhanced-table-checkbox-${index}`;
                                                    return (
                                                        <tr
                                                            key={index}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                if (
                                                                    !checkSameCustomerVisas(
                                                                        visa
                                                                            .customer
                                                                            .id,
                                                                    )
                                                                ) {
                                                                    handleClick(
                                                                        event,
                                                                        visa,
                                                                    );
                                                                }
                                                            }}
                                                            role="checkbox"
                                                            aria-checked={
                                                                isItemSelected
                                                            }
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
                                                            <td>
                                                                {visa.visa_no}
                                                            </td>
                                                            <td>
                                                                {visa.created_at.substring(
                                                                    0,
                                                                    10,
                                                                )}
                                                            </td>
                                                            <td>
                                                                {
                                                                    visa.passport_no
                                                                }
                                                            </td>
                                                            <td>{visa.name}</td>
                                                            <td>
                                                                {
                                                                    visa
                                                                        .customer
                                                                        .name
                                                                }
                                                            </td>
                                                            <td>
                                                                {visa.type.name}
                                                            </td>
                                                            <td>
                                                                {
                                                                    visa.branch
                                                                        .name
                                                                }
                                                            </td>
                                                            <td>
                                                                {new Intl.NumberFormat(
                                                                    "en",
                                                                ).format(
                                                                    visa.price,
                                                                )}{" "}
                                                                {
                                                                    (
                                                                        visa as any
                                                                    ).currency
                                                                        .symbol
                                                                }
                                                            </td>
                                                            <td>
                                                                {new Intl.NumberFormat(
                                                                    "en",
                                                                ).format(
                                                                    visa.price -
                                                                        visa.paid_amount,
                                                                )}{" "}
                                                                {
                                                                    (
                                                                        visa as any
                                                                    ).currency
                                                                        .symbol
                                                                }
                                                            </td>
                                                            <td>
                                                                <Checkbox
                                                                    disabled={checkSameCustomerVisas(
                                                                        visa
                                                                            .customer
                                                                            .id,
                                                                    )}
                                                                    checked={
                                                                        isItemSelected
                                                                    }
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
                                                },
                                            )}
                                    </tbody>
                                </Table>
                            </Sheet>
                        </CardContent>
                    </Card>
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
}

export default ViewVisaSelection;
