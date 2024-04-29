import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { SendActionRequest } from "@/Utils/helpers";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import axiosInstance from "@/Pages/Plugins/axiosIns";

interface IProps {
    openState: boolean;
    setOpenState(state: boolean, is_updated: boolean): void;
    id: number;
}

export default function VisaCancelModel({
    openState,
    setOpenState,
    id,
}: IProps) {
    const [useData, setData] = React.useState({
        reason: "",
        visa_id: 0,
        loading: false,
    });

    const onSubmit = () => {
        setData((prevState) => ({
            ...prevState,
            loading: true,
        }));

        const Config = SendActionRequest(
            {
                _class: "VisaLogics",
                _method_name: "cancel_visa",
                _validation_class: null,
            },
            useData,
        );

        axiosInstance
            .post(Config.url, Config.payload)
            .then(() => {
                setOpenState(false, true);
            })
            .finally(() =>
                setData((prevState) => ({
                    ...prevState,
                    loading: false,
                })),
            );
    };

    React.useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            visa_id: id,
        }));
    }, [id]);
    return (
        <React.Fragment>
            <Modal
                open={openState}
                onClose={() => {
                    setOpenState(false, false);
                }}
            >
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        ویزه لغوه تایید
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        ایا تاسي مطمین یاست د ویزي په لغوه کولو سره؟
                        <FormControl>
                            <FormLabel>دلیل</FormLabel>
                            <Textarea
                                value={useData.reason as string}
                                onChange={(
                                    e: React.ChangeEvent<HTMLTextAreaElement>,
                                ) =>
                                    setData((prevState) => ({
                                        ...prevState,
                                        reason: e.target.value as string,
                                    }))
                                }
                                minRows={5}
                            ></Textarea>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="danger"
                            autoFocus
                            loading={useData.loading}
                            onClick={() => onSubmit()}
                        >
                            لغوه
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => {
                                setOpenState(false, false);
                            }}
                        >
                            شاته
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
