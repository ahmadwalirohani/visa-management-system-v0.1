import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Snackbar from "@mui/joy/Snackbar";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Button from "@mui/joy/Button";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import AspectRatio from "@mui/joy/AspectRatio";
import IconButton from "@mui/joy/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Stack from "@mui/joy/Stack";
import { styled } from "@mui/joy";

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
        name: {
            msg: string;
            state: boolean;
        };
        password: {
            msg: string;
            state: boolean;
        };
        email: {
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
        user_id: null | number;
    };
    resetForm(): void;
    preImage: string;
    onImageUpload(e: ChangeEvent): void;
}

const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

function AddUser({
    formValidation,
    onSubmit,
    useSnackbar,
    closeSnackbar,
    formRef,
    formInfo,
    resetForm,
    preImage,
    onImageUpload,
}: FormProps) {
    return (
        <>
            <Typography level="h4" sx={{ mb: 3 }}>
                یوزران
            </Typography>

            <form
                onSubmit={(event: React.FormEvent<UserAdditionFormElement>) =>
                    onSubmit(event)
                }
                ref={formRef}
                method="post"
            >
                <Stack
                    width={100}
                    sx={{
                        position: "relative",
                        margin: "auto",
                    }}
                >
                    <AspectRatio
                        ratio="1"
                        maxHeight={150}
                        sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
                    >
                        <img src={preImage as string} loading="lazy" alt="" />
                    </AspectRatio>
                    <IconButton
                        aria-label="upload new picture"
                        size="sm"
                        component="label"
                        role={undefined}
                        tabIndex={-1}
                        variant="outlined"
                        color="neutral"
                        sx={{
                            bgcolor: "background.body",
                            position: "absolute",
                            zIndex: 2,
                            borderRadius: "50%",
                            left: 50,
                            top: 100,
                            boxShadow: "sm",
                        }}
                    >
                        <VisuallyHiddenInput
                            type="file"
                            id="image-as"
                            name="image"
                            onChange={(e) => onImageUpload(e)}
                        />
                        <EditRoundedIcon />
                    </IconButton>
                </Stack>

                <FormControl sx={{ mt: 2 }} error={formValidation.name.state}>
                    <Input required name="name" placeholder="یوزر نوم *" />
                    {formValidation.name.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.name.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl sx={{ mt: 2 }} error={formValidation.email.state}>
                    <Input
                        name="email"
                        type="email"
                        placeholder="یوزر ایمیل ادرس *"
                    />
                    {formValidation.email.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.email.msg}
                        </FormHelperText>
                    )}
                </FormControl>
                <FormControl
                    sx={{ mt: 2 }}
                    error={formValidation.password.state}
                >
                    <Input
                        name="password"
                        type="password"
                        placeholder="یوزر  فاسورډ *"
                    />
                    {formValidation.password.state && (
                        <FormHelperText>
                            <InfoOutlined />
                            {formValidation.password.msg}
                        </FormHelperText>
                    )}
                </FormControl>

                <br />
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

export default AddUser;
