import { Card, CardContent, Grid } from "@mui/joy";
import Stepper from "@mui/joy/Stepper";
import Step, { stepClasses } from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import Typography, { typographyClasses } from "@mui/joy/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import NewVisa from "./UserLogsPartials/NewVisa";
import { useEffect, useState } from "react";
import { getUserLogs } from "@/Utils/DashboardResources";

function UserLogs() {
    const [userLogs, setUserLogs] = useState<Array<any>>([]);

    const resolveActionType = {
        "ADD-NEW-VISA": function () {
            return <NewVisa />;
        },
    };

    useEffect(() => {
        getUserLogs({}, function (_logs: Array<any>): void {
            setUserLogs(_logs);
        });
    }, []);
    return (
        <Grid md={4}>
            <Card>
                <Typography level="h4">یوزر فعالیتونه</Typography>
                <CardContent sx={{ height: "30dvh", overflow: "auto" }}>
                    <Stepper
                        orientation="vertical"
                        sx={{
                            "--Stepper-verticalGap": "2.5rem",
                            "--StepIndicator-size": "2.5rem",
                            "--Step-gap": "1rem",
                            "--Step-connectorInset": "0.5rem",
                            "--Step-connectorRadius": "1rem",
                            "--Step-connectorThickness": "4px",
                            "--joy-palette-success-solidBg":
                                "var(--joy-palette-success-400)",
                            [`& .${stepClasses.completed}`]: {
                                "&::after": {
                                    bgcolor: "success.solidBg",
                                },
                            },
                            [`& .${stepClasses.active}`]: {
                                [`& .${stepIndicatorClasses.root}`]: {
                                    border: "4px solid",
                                    borderColor: "#fff",
                                    boxShadow: (theme) =>
                                        `0 0 0 1px ${theme.vars.palette.primary[500]}`,
                                },
                            },
                            [`& .${stepClasses.disabled} *`]: {
                                color: "neutral.softDisabledColor",
                            },
                            [`& .${typographyClasses["title-sm"]}`]: {
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                fontSize: "10px",
                            },
                        }}
                    >
                        {userLogs.map((action: any) =>
                            resolveActionType[
                                action.type as keyof typeof resolveActionType
                            ](),
                        )}

                        <Step
                            completed
                            indicator={
                                <StepIndicator variant="solid" color="success">
                                    <CheckRoundedIcon />
                                </StepIndicator>
                            }
                        >
                            <div>
                                <Typography level="title-sm">Step 2</Typography>
                                Company Details
                            </div>
                        </Step>
                        <Step
                            active
                            indicator={
                                <StepIndicator variant="solid" color="primary">
                                    <AppRegistrationRoundedIcon />
                                </StepIndicator>
                            }
                        >
                            <div>
                                <Typography level="title-sm">Step 3</Typography>
                                Subscription plan
                            </div>
                        </Step>
                        <Step
                            disabled
                            indicator={<StepIndicator>3</StepIndicator>}
                        >
                            <div>
                                <Typography level="title-sm">Step 4</Typography>
                                Payment details
                            </div>
                        </Step>
                    </Stepper>
                </CardContent>
            </Card>
        </Grid>
    );
}

export default UserLogs;
