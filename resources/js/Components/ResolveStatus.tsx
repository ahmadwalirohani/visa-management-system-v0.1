import { Chip } from "@mui/joy";
import React from "react";

interface IProps {
    status: number;
}

function ResolveStatus({ status }: IProps) {
    return (
        <React.Fragment>
            {status == 1 && (
                <Chip variant="outlined" color="success">
                    فعاله
                </Chip>
            )}
            {status == 0 && (
                <Chip variant="outlined" color="danger">
                    غیري فعاله
                </Chip>
            )}
        </React.Fragment>
    );
}

export default ResolveStatus;
