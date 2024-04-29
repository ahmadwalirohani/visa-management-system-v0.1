import { Stack, Step, Typography } from "@mui/joy";
import StepIndicator from "@mui/joy/StepIndicator";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

function NewVisa() {
    return (
        <Step
            completed
            indicator={
                <StepIndicator variant="solid" color="success">
                    <CheckRoundedIcon />
                </StepIndicator>
            }
        >
            <div>
                <Typography level="title-sm">
                    ahmadwalirohani@gmail.com &nbsp;&nbsp;|&nbsp;&nbsp; Admin
                    &nbsp;&nbsp;|&nbsp;&nbsp; عمومي څانکه
                </Typography>
                <Typography level="title-sm">1402-02-03 10:30</Typography>د ویزي
                ثبت
            </div>
            <Stack spacing={1}>
                <Typography level="body-sm">
                    Ron Swanson <br />
                    14 Lakeshore Drive <br />
                    Pawnee, IN 12345 <br />
                    United States <br />
                    T: 555-555-5555
                </Typography>
            </Stack>
        </Step>
    );
}

export default NewVisa;
