import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Snackbar from "@mui/joy/Snackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import React, { FormEvent } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import { Divider, Table } from "@mui/material";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    symbol: HTMLInputElement;
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
        symbol: {
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
        currency_id: null | number;
    };
    resetForm(): void;
}

function AddCurrency({
    formValidation,
    onSubmit,
    useSnackbar,
    closeSnackbar,
    formRef,
    formInfo,
    resetForm,
}: FormProps) {
    return (
        <>
            <Typography level="h4" sx={{ mb: 3 }}>
                اسعار او نرخونه
            </Typography>

            <form
                onSubmit={(
                    event: React.FormEvent<CurrencyAdditionFormElement>,
                ) => onSubmit(event)}
                ref={formRef}
                method="post"
            >
                <FormControl sx={{ mt: 2 }} error={formValidation.name.state}>
                    <Input name="name" placeholder="اسعار نوم *" />
                    {formValidation.name.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.name.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl sx={{ mt: 2 }} error={formValidation.symbol.state}>
                    <Input name="symbol" placeholder="اسعار سمبول *" />
                    {formValidation.symbol.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.symbol.msg}
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

            <Divider />

            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                    </tr>
                </thead>
            </Table>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={2000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => closeSnackbar()}
            >
                {useSnackbar.msg}
            </Snackbar>
        </>
    );
}

export default AddCurrency;
