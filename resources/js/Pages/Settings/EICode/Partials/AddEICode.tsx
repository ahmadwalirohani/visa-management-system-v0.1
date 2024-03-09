import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Snackbar from "@mui/joy/Snackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import React, { FormEvent } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import { Option, Select } from "@mui/joy";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    code: HTMLInputElement;
    type: HTMLSelectElement;
}
interface CurrencyAdditionFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

interface FormProps {
    formValidation: {
        name: {
            msg: string;
            state: boolean;
        };
        code: {
            msg: string;
            state: boolean;
        };
        type: {
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
        eicode_id: null | number;
    };
    resetForm(): void;
    selectedType: string;
    changeCodeType(type: any): void;
}

function AddEICode({
    formValidation,
    onSubmit,
    useSnackbar,
    closeSnackbar,
    formRef,
    formInfo,
    resetForm,
    selectedType,
    changeCodeType,
}: FormProps) {
    return (
        <>
            <Typography level="h4" sx={{ mb: 3 }}>
                د مصارفو او عوایدو کودونه
            </Typography>

            <form
                onSubmit={(
                    event: React.FormEvent<CurrencyAdditionFormElement>,
                ) => onSubmit(event)}
                ref={formRef}
                method="post"
            >
                <FormControl sx={{ mt: 2 }} error={formValidation.name.state}>
                    <Input name="name" placeholder=" نوم *" />
                    {formValidation.name.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.name.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl sx={{ mt: 2 }} error={formValidation.code.state}>
                    <Input name="code" placeholder="کود  *" />
                    {formValidation.code.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.code.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl sx={{ mt: 2 }} error={formValidation.type.state}>
                    <Select
                        value={selectedType}
                        name="type"
                        onChange={(e) =>
                            changeCodeType(
                                (e?.target as HTMLSelectElement).selectedIndex,
                            )
                        }
                        placeholder="کود  *"
                    >
                        <Option value="EXPENSE">مصرف</Option>
                        <Option value="INCOME">عاید</Option>
                    </Select>
                    {formValidation.type.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.type.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    variant={formInfo.is_update ? "outlined" : "solid"}
                    style={{ marginTop: 20 }}
                    loading={formInfo.loading}
                >
                    {formInfo.is_update ? "تغیر" : "ثبت"}
                </Button>
                <Button
                    type="reset"
                    variant="soft"
                    onClick={() => resetForm()}
                    style={{ marginTop: 20, marginRight: 30 }}
                >
                    {" "}
                    پاکول{" "}
                </Button>
            </form>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={3000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => closeSnackbar()}
            >
                {useSnackbar.msg}
            </Snackbar>
        </>
    );
}

export default AddEICode;
