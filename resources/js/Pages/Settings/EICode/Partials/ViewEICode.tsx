import Table from "@mui/joy/Table";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Button from "@mui/joy/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Edit from "@mui/icons-material/Edit";
import Chip from "@mui/joy/Chip";
import LinearProgress from "@mui/joy/LinearProgress";

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

const resolveType = (type: string): string => {
    if (type == "EXPENSE") return "مصرف";
    return "عاید";
};

interface IViewProps {
    expense_income_codes: Array<object>;
    fetchLoading: boolean;
    editEICode(eicode: object): void;
    changeStatus(eicode: object): void;
}

function ViewEICode({
    expense_income_codes,
    fetchLoading,
    editEICode,
    changeStatus,
}: IViewProps) {
    return (
        <>
            <div style={{ height: 5 }}>
                {fetchLoading && <LinearProgress />}
            </div>

            <Table aria-label="eicode table" stickyHeader stickyFooter hoverRow>
                <thead>
                    <tr>
                        <th style={{ textAlign: "right" }}>#</th>
                        <th style={{ textAlign: "right" }}>نوم</th>
                        <th style={{ textAlign: "right" }}>کود</th>
                        <th style={{ textAlign: "right" }}>ډول</th>
                        <th style={{ textAlign: "right" }}>حالت</th>
                        <th style={{ textAlign: "right" }}>عملیی</th>
                    </tr>
                </thead>
                <tbody>
                    {expense_income_codes.map((row: any, index: number) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>{row.name}</td>
                            <td>{row.code}</td>
                            <td>{resolveType(row.type as string)}</td>
                            <td>{resolveStatus(row.status)}</td>
                            <td dir="ltr" style={{ width: 100 }}>
                                <ButtonGroup>
                                    <Button
                                        onClick={() => changeStatus(row)}
                                        title="اسعار حالت تغیرول"
                                    >
                                        {row.status == 1 && <VisibilityOff />}
                                        {row.status == 0 && <Visibility />}
                                    </Button>
                                    <Button onClick={() => editEICode(row)}>
                                        <Edit />
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

export default ViewEICode;
