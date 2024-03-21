import {
    Button,
    ColorPaletteProp,
    DialogContent,
    FormControl,
    FormHelperText,
    Input,
    Modal,
    ModalClose,
    ModalDialog,
    ModalDialogProps,
    Option,
    Select,
    Snackbar,
    Stack,
} from "@mui/joy";
import { ChangeEvent, FormEvent } from "react";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

interface IModalProps {
    setLayoutState(state: ModalDialogProps["layout"] | undefined): void;
    layout: undefined | any;
    formValidation: {
        name: {
            msg: string;
            state: boolean;
        };
        code: {
            msg: string;
            state: boolean;
        };
    };
    onSubmit(e: FormEvent): void;
    useSnackbar: {
        msg: string;
        is_open: boolean;
        state: string;
    };
    closeSnackbar(): void;
    formRef: React.MutableRefObject<HTMLFormElement | null>;
    formInfo: {
        loading: boolean;
        is_update: boolean;
        type_id: null | number;
    };
    visa_types: Array<object>;
    selectedVisaType: string | null;
    handleVisaTypeChange(
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ): void;
    formData: {
        name: string;
        code: string;
    };
    handleOnInputChange(e: ChangeEvent, field: string): void;
}

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    code: HTMLInputElement;
    type: HTMLSelectElement;
}
interface TypeAdditionFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

function AddVisaSubType({
    setLayoutState,
    layout,
    formValidation,
    onSubmit,
    useSnackbar,
    closeSnackbar,
    formRef,
    formInfo,
    visa_types,
    selectedVisaType,
    handleVisaTypeChange,
    handleOnInputChange,
    formData,
}: IModalProps) {
    return (
        <>
            <Modal
                open={!!layout}
                onClose={() => {
                    setLayoutState(undefined);
                }}
                dir="rtl"
            >
                <ModalDialog dir="rtl" layout={layout}>
                    <p style={{ fontSize: "small" }}>
                        د ویزي د ډول دخولي نوعیت اضافه کول
                    </p>
                    <ModalClose
                        sx={{
                            right: "inherit",
                            left: "var(--ModalClose-inset)",
                        }}
                    />

                    <DialogContent
                        sx={{
                            overflow: "hidden",
                        }}
                    >
                        <form
                            onSubmit={(
                                event: React.FormEvent<TypeAdditionFormElement>,
                            ) => onSubmit(event)}
                            ref={formRef}
                            method="post"
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Stack spacing={2}>
                                <FormControl sx={{ mt: 2 }}>
                                    <Select
                                        value={selectedVisaType}
                                        placeholder="ویزي ډول انتخاب"
                                        onChange={handleVisaTypeChange}
                                        required
                                    >
                                        {visa_types.map(
                                            (type: any, index: number) => (
                                                <Option
                                                    value={type.id}
                                                    key={index}
                                                >
                                                    {type.name}
                                                </Option>
                                            ),
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    error={formValidation.name.state}
                                >
                                    <Input
                                        name="name"
                                        placeholder="نوعیت نوم *"
                                        value={formData.name}
                                        onChange={(e) =>
                                            handleOnInputChange(e, "name")
                                        }
                                    />
                                    {formValidation.name.state && (
                                        <FormHelperText>
                                            <InfoOutlined />
                                            {formValidation.name.msg}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    error={formValidation.code.state}
                                >
                                    <Input
                                        name="code"
                                        placeholder="نوعیت کود *"
                                        value={formData.code}
                                        onChange={(e) =>
                                            handleOnInputChange(e, "code")
                                        }
                                    />
                                    {formValidation.code.state && (
                                        <FormHelperText>
                                            <InfoOutlined />
                                            {formValidation.code.msg}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <Button
                                    type="submit"
                                    variant={
                                        formInfo.is_update
                                            ? "outlined"
                                            : "solid"
                                    }
                                    style={{ marginTop: 20 }}
                                    loading={formInfo.loading}
                                >
                                    {formInfo.is_update ? "تغیر" : "ثبت"}
                                </Button>
                            </Stack>
                        </form>

                        <Snackbar
                            variant="solid"
                            color={useSnackbar.state as ColorPaletteProp}
                            autoHideDuration={2000}
                            open={useSnackbar.is_open}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            onClose={() => closeSnackbar()}
                        >
                            {useSnackbar.msg}
                        </Snackbar>
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </>
    );
}

export default AddVisaSubType;
