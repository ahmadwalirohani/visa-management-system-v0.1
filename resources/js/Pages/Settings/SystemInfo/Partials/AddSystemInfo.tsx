import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Snackbar from "@mui/joy/Snackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import React, { ChangeEvent, FormEvent } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import AspectRatio from "@mui/joy/AspectRatio";
import Stack from "@mui/joy/Stack";

interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    password: HTMLInputElement;
    email: HTMLInputElement;
}
interface UserAdditionFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

interface FormProps {
    formValidation: {
        company_name: {
            msg: string;
            state: boolean;
        };
        company_ceo: {
            msg: string;
            state: boolean;
        };
        company_email: {
            msg: string;
            state: boolean;
        };
        company_address: {
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
        company_ceo: string;
        company_name: string;
        company_address: string;
        company_email: string;
        company_phone1: string | null;
        company_phone2: string | null;
        company_logo: string;
        voucher_no: number;
        payment_no: number;
        visa_no: number;
        loading: boolean;
    };
    resetForm(): void;
    preImage: string;
    handleOnInputChange(e: ChangeEvent, field: string): void;
}

function AddSystemInfo({
    formValidation,
    onSubmit,
    useSnackbar,
    closeSnackbar,
    formRef,
    formInfo,
    resetForm,
    preImage,
    handleOnInputChange,
}: FormProps) {
    return (
        <>
            <Typography level="h4" sx={{ mb: 3 }}>
                سیستم عمومي معلومات
            </Typography>

            <form
                onSubmit={(event: React.FormEvent<UserAdditionFormElement>) =>
                    onSubmit(event)
                }
                ref={formRef}
                method="post"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                <Stack
                    width={"100"}
                    sx={{
                        position: "relative",
                        margin: "auto",
                    }}
                >
                    <AspectRatio
                        ratio="1"
                        maxHeight={150}
                        sx={{ flex: 1, minWidth: 120 }}
                    >
                        <img src={preImage as string} loading="lazy" alt="" />
                    </AspectRatio>
                </Stack>

                <FormControl
                    sx={{ mt: 2, width: "100%" }}
                    error={formValidation.company_name.state}
                >
                    <Input
                        required
                        name="company_name"
                        value={formInfo.company_name}
                        placeholder="شرکت نوم *"
                        onChange={(e) => handleOnInputChange(e, "company_name")}
                    />
                    {formValidation.company_name.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.company_name.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl
                    sx={{ mt: 2, width: "100%" }}
                    error={formValidation.company_ceo.state}
                >
                    <Input
                        required
                        name="company_ceo"
                        value={formInfo.company_ceo}
                        placeholder="شرکت CEO نوم *"
                        onChange={(e) => handleOnInputChange(e, "company_ceo")}
                    />
                    {formValidation.company_ceo.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.company_ceo.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl
                    sx={{ mt: 2, width: "100%" }}
                    error={formValidation.company_email.state}
                >
                    <Input
                        name="company_email"
                        type="email"
                        value={formInfo.company_email}
                        placeholder="شرکت ایمیل ادرس *"
                        onChange={(e) =>
                            handleOnInputChange(e, "company_email")
                        }
                    />
                    {formValidation.company_email.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.company_email.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl
                    sx={{ mt: 2, width: "100%" }}
                    error={formValidation.company_address.state}
                >
                    <Input
                        required
                        name="company_address"
                        value={formInfo.company_address}
                        placeholder="شرکت  ادرس *"
                        onChange={(e) =>
                            handleOnInputChange(e, "company_address")
                        }
                    />
                    {formValidation.company_address.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.company_address.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <FormControl sx={{ mt: 2, width: "45%" }}>
                    <Input
                        required
                        name="company_phone1"
                        value={formInfo.company_phone1 as string}
                        placeholder="شرکت مبایل شمیره 1 "
                        onChange={(e) =>
                            handleOnInputChange(e, "company_phone1")
                        }
                    />
                </FormControl>

                <FormControl sx={{ mt: 2, width: "45%", mr: 1 }}>
                    <Input
                        required
                        name="company_phone2"
                        value={formInfo.company_phone2 as string}
                        placeholder="شرکت مبایل شمیره 2  "
                        onChange={(e) =>
                            handleOnInputChange(e, "company_phone2")
                        }
                    />
                </FormControl>

                <FormControl sx={{ mt: 2, width: "28%", mr: 1 }}>
                    <Input
                        required
                        type="number"
                        name="visa_no"
                        value={formInfo.visa_no}
                        placeholder="ویزي نمبر"
                        onChange={(e) => handleOnInputChange(e, "visa_no")}
                    />
                </FormControl>

                <FormControl sx={{ mt: 2, width: "28%", mr: 1 }}>
                    <Input
                        required
                        type="number"
                        name="voucher_no"
                        value={formInfo.voucher_no}
                        placeholder="وچر نمبر"
                        onChange={(e) => handleOnInputChange(e, "voucher_no")}
                    />
                </FormControl>

                <FormControl sx={{ mt: 2, width: "28%", mr: 1 }}>
                    <Input
                        required
                        type="number"
                        name="payment_no"
                        value={formInfo.payment_no}
                        placeholder=" رسید نمبر"
                        onChange={(e) => handleOnInputChange(e, "payment_no")}
                    />
                </FormControl>

                <br />
                <Button
                    type="submit"
                    variant="solid"
                    style={{ marginTop: 20 }}
                    loading={formInfo.loading}
                >
                    {"ثبت"}
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

export default AddSystemInfo;
