import { Avatar, IconButton, Sheet, Table, Typography } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React from "react";

function VisaCommitredRow(props: { row: any; initialOpen?: boolean }) {
    const { row } = props;

    const [open, setOpen] = React.useState(props.initialOpen || false);

    return (
        <React.Fragment>
            <tr>
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
                <td>
                    <Avatar alt="User Image" src={row.image} />
                </td>
                <td>{row.name}</td>
                <td>{row.customer.name}</td>
                <td>{row.remarks}</td>
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
                                ویزي
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
                                        <th>#</th>
                                        <th>ویزي نمبر</th>
                                        <th>نوم</th>
                                        <th>فاسپورټ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.commited_visas?.map(
                                        (visa: any, pi: number) => (
                                            <tr key={pi}>
                                                <td scope="row">{pi + 1}</td>
                                                <td>{visa.visa.visa_no}</td>
                                                <td>{visa.visa.name}</td>
                                                <td>{visa.visa.passport_no}</td>
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

export default VisaCommitredRow;
