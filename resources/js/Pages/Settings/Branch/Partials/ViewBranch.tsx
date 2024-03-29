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
    branches: Array<object>;
    fetchLoading: boolean;
    editBranch(branch: object): void;
    changeStatus(branch: object): void;
    changeToMain(branch_id: number): void;
}

function ViewBranch({
    branches,
    fetchLoading,
    editBranch,
    changeStatus,
    changeToMain,
}: IViewProps) {
    return (
        <>
            <div style={{ height: 5 }}>
                {fetchLoading && <LinearProgress />}
            </div>

            <Table
                aria-label="branch table"
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
                        <th style={{ textAlign: "right" }}>ادرس</th>
                        <th style={{ textAlign: "right" }}>مسؤل</th>
                        <th style={{ textAlign: "right" }}>حالت</th>
                        <th style={{ textAlign: "right" }}>عملیی</th>
                    </tr>
                </thead>
                <tbody>
                    {branches.map((row: any, index: number) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.address}</td>
                            <td>{row.admin}</td>
                            <td style={{ width: 120 }}>
                                <div
                                    style={{
                                        display: "flex",
                                    }}
                                >
                                    {resolveStatus(row.status)}

                                    {row.is_main == 1 && (
                                        <Chip
                                            variant="outlined"
                                            color="neutral"
                                            size="lg"
                                            endDecorator={<CheckIcon />}
                                        >
                                            عمومي
                                        </Chip>
                                    )}
                                </div>
                            </td>
                            <td dir="ltr" style={{ width: 100 }}>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => changeStatus(row)}
                                        title="څانګه حالت تغیرول"
                                    >
                                        {row.status == 1 && <VisibilityOff />}
                                        {row.status == 0 && <Visibility />}
                                    </Button>
                                    <Button onClick={() => editBranch(row)}>
                                        <Edit />
                                    </Button>
                                    <Button
                                        disabled={row.is_main == 1}
                                        onClick={() => changeToMain(row.id)}
                                        title="څانګه د عمومي په حیث ثبتول"
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

export default ViewBranch;
