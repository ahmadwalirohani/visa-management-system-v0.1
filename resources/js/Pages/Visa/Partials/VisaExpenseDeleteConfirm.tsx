import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

interface IProps {
    openState: boolean;
    setOpenState(state: boolean, is_updated: boolean): void;
    id: number;
}

export default function VisaExpenseDeleteConfirm({
    openState,
    setOpenState,
    id,
}: IProps) {
    const [useData, setData] = React.useState({
        reason: "",
        id: 0,
        loading: false,
    });

    React.useEffect(() => {
        setData((prevState) => ({
            ...prevState,
            id: id,
        }));
    }, [id]);
    return (
        <React.Fragment>
            <Modal open={openState} onClose={() => setOpenState(false, false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />د ویزي مصرف حذف تاییدي
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        ایا تاسي مطمین یاست چي د ویزي مصرف حذف کړي
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            loading={useData.loading}
                            color="danger"
                            onClick={() => setOpenState(false, true)}
                        >
                            حذف
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setOpenState(false, false)}
                        >
                            شاته
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
