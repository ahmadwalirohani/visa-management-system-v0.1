import Edit from "@mui/icons-material/Edit";
import {
    Button,
    ButtonGroup,
    Chip,
    IconButton,
    Sheet,
    Table,
    Typography,
} from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React from "react";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

function TillRow(props: {
    row: any;
    initialOpen?: boolean;
    onTillStatusChange(row: any): void;
    sendTillData(row: any): void;
    openTillActionsView(
        state: boolean,
        id: number,
        is_open: number,
        balancies: Array<any>,
    ): void;
}) {
    const { row } = props;
    const { privileges } = useUserBranchesContext();

    const [open, setOpen] = React.useState(props.initialOpen || false);

    return (
        <React.Fragment>
            <tr
                onClick={(e) => {
                    if (
                        (e.target as any).tagName != "BUTTON" &&
                        (e.target as any).tagName != "svg" &&
                        privileges.till.actions.opening_closing == true
                    ) {
                        props.openTillActionsView(
                            true,
                            row.id,
                            row.is_open,
                            row.balancies,
                        );
                    }
                }}
            >
                <td>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            aria-label="expand row"
                            variant="plain"
                            color="neutral"
                            size="sm"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                        <div>{row.id}</div>
                    </div>
                </td>
                <td>{row.name}</td>
                <td>{row.branch.name}</td>
                <td>{row.code}</td>
                <td style={{ width: 120 }}>
                    {row.status == 1 && (
                        <Chip variant="outlined" color="success">
                            فعاله
                        </Chip>
                    )}
                    {row.status == 0 && (
                        <Chip variant="outlined" color="danger">
                            غیري فعاله
                        </Chip>
                    )}
                </td>
                <td dir="ltr" style={{ width: 100 }}>
                    <ButtonGroup>
                        <Button
                            onClick={() => props.onTillStatusChange(row)}
                            title="دخل ډول حالت تغیرول"
                        >
                            {row.status == 1 && <VisibilityOff />}
                            {row.status == 0 && <Visibility />}
                        </Button>
                        <Button
                            disabled={privileges.till.actions.edit == false}
                            onClick={() => props.sendTillData(row)}
                        >
                            <Edit />
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
            <tr>
                <td style={{ height: 0, padding: 0 }} colSpan={6}>
                    {open && (
                        <Sheet
                            variant="soft"
                            sx={{
                                p: 1,
                                pl: 6,
                                boxShadow:
                                    "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
                            }}
                        >
                            <Typography level="body-lg" component="div">
                                دخل موجودي
                            </Typography>
                            <Table
                                borderAxis="bothBetween"
                                size="sm"
                                aria-label="purchases"
                                sx={{
                                    "& > thead > tr > th": {
                                        textAlign: "right",
                                    },
                                    "--TableCell-paddingX": "0.5rem",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>مبلغ</th>
                                        <th>اسعار</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.balancies?.map(
                                        (balance: any, pi: number) => (
                                            <tr key={pi}>
                                                <td scope="row">
                                                    {balance.id}
                                                </td>
                                                <td>
                                                    {new Intl.NumberFormat(
                                                        "en",
                                                    ).format(balance.balance)}
                                                </td>
                                                <td>{balance.currency.name}</td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </Table>
                        </Sheet>
                    )}
                </td>
            </tr>
        </React.Fragment>
    );
}

export default TillRow;
