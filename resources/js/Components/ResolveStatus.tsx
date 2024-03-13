import { Chip } from "@mui/joy";

interface IProps {
    status: number;
}

function ResolveStatus({ status }: IProps) {
    return (
        <>
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
        </>
    );
}

export default ResolveStatus;
