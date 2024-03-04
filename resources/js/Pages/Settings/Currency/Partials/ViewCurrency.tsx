import Table from "@mui/joy/Table";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Button from "@mui/joy/Button";
import Visibility from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Edit from "@mui/icons-material/Edit";
import Chip from "@mui/joy/Chip";
import LinearProgress from "@mui/joy/LinearProgress";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

const resolveStatus = (status: number | boolean) => {
    if (status)
        return (
            <Chip variant="outlined" color="success">
                فعاله
            </Chip>
        );
    else
        return (
            <Chip variant="outlined" color="danger">
                غیري فعاله
            </Chip>
        );
};

interface IViewProps {
    currencies: Array<object>;
    fetchLoading: boolean;
    editCurrency(currency: object): void;
    changeStatus(currency: object): void;
    changeToDefault(currency_id: number): void;
}

function ViewCurrency({
    currencies,
    fetchLoading,
    editCurrency,
    changeStatus,
    changeToDefault,
}: IViewProps) {
    return (
        <>
            <div style={{ height: 5 }}>
                {fetchLoading && <LinearProgress />}
            </div>

            <Table
                aria-label="currency table"
                stickyHeader
                stickyFooter
                hoverRow
                sx={{
                    tableLayout: "auto",
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "right" }}>#</th>
                        <th style={{ textAlign: "right" }}>نوم</th>
                        <th style={{ textAlign: "right" }}>سمبول</th>
                        <th style={{ textAlign: "right" }}>حالت</th>
                        <th style={{ textAlign: "right" }}>عملیی</th>
                    </tr>
                </thead>
                <tbody>
                    {currencies.map((row: any, index: number) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.symbol}</td>
                            <td style={{ width: 120 }}>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    {resolveStatus(row.status)}

                                    {row.is_default == 1 && (
                                        <Chip
                                            variant="outlined"
                                            color="neutral"
                                            size="lg"
                                            endDecorator={<CheckIcon />}
                                        ></Chip>
                                    )}
                                </div>
                            </td>
                            <td dir="ltr" style={{ width: 100 }}>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => changeStatus(row)}
                                        title="اسعار حالت تغیرول"
                                    >
                                        {row.status == 1 && <VisibilityOff />}
                                        {row.status == 0 && <Visibility />}
                                    </Button>
                                    <Button onClick={() => editCurrency(row)}>
                                        <Edit />
                                    </Button>
                                    <Button
                                        disabled={row.is_default == 1}
                                        onClick={() => changeToDefault(row.id)}
                                        title="اسعار د عمومي په حیث ثبتول"
                                    >
                                        <DoneOutlineIcon />
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default ViewCurrency;
