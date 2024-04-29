import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";

interface IProps {
    modalProps: {
        state: boolean;
        obsence: number | null;
        tax: null | number;
        overtime: number | null;
        net_salary: number | null;
        index: number;
    };
    setOpen(state: boolean): void;
    onChange(field: string, value: any): void;
}

export default function PayrollEditModal({
    modalProps,
    setOpen,
    onChange,
}: IProps) {
    return (
        <React.Fragment>
            <Modal open={modalProps.state} onClose={() => setOpen(false)}>
                <ModalDialog>
                    <DialogTitle>معلوماتو تغیر</DialogTitle>
                    {/* <DialogContent>
                        Fill in the information of the project.
                    </DialogContent> */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setOpen(false);
                        }}
                    >
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel>غیري حاضر ورځي</FormLabel>
                                <Input
                                    autoFocus
                                    required
                                    value={modalProps.obsence as any}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange("obsence", e.target.value)}
                                    type="number"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>اضافه کاري</FormLabel>
                                <Input
                                    required
                                    value={modalProps.overtime as any}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange("overtime", e.target.value)}
                                    type="number"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>مالیه</FormLabel>
                                <Input
                                    required
                                    value={modalProps.tax as any}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange("tax", e.target.value)}
                                    type="number"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>خالص معاش</FormLabel>
                                <Input
                                    required
                                    value={modalProps.net_salary as any}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => onChange("net_salary", e.target.value)}
                                    type="number"
                                />
                            </FormControl>
                            <Button type="submit">ثبت</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
