import Table from "@mui/joy/Table";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Avatar from "@mui/joy/Avatar";
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

interface IViewProps {
    users: Array<object>;
    fetchLoading: boolean;
    editUser(user: object): void;
    changeStatus(user: object): void;
}

function ViewUser({ users, fetchLoading, editUser, changeStatus }: IViewProps) {
    return (
        <>
            <div style={{ height: 5 }}>
                {fetchLoading && <LinearProgress />}
            </div>

            <Table aria-label="user table" stickyHeader stickyFooter hoverRow>
                <thead>
                    <tr>
                        <th style={{ textAlign: "right" }}>#</th>
                        <th style={{ textAlign: "right" }}>عکس</th>
                        <th style={{ textAlign: "right" }}>نوم</th>
                        <th style={{ textAlign: "right" }}> ایمیل ادرس</th>
                        <th style={{ textAlign: "right" }}>حالت</th>
                        <th style={{ textAlign: "right" }}>عملیی</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((row: any, index: number) => (
                        <tr key={row.id}>
                            <td>{index + 1}</td>
                            <td>
                                <Avatar alt="User Image" src={row.image} />
                            </td>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{resolveStatus(row.status)}</td>
                            <td dir="ltr">
                                <ButtonGroup>
                                    <Button onClick={() => changeStatus(row)}>
                                        {row.status == 1 && <VisibilityOff />}
                                        {row.status == 0 && <Visibility />}
                                    </Button>
                                    <Button onClick={() => editUser(row)}>
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

export default ViewUser;
