import { SendResourceRequest } from "@/Utils/helpers";
import {
    Button,
    ColorPaletteProp,
    Grid,
    Option,
    Select,
    Snackbar,
} from "@mui/joy";
import axios, { AxiosResponse } from "axios";
import { FormEvent, useEffect, useState } from "react";

interface IForm {
    branch: string | null;
    role: string | null;
    is_update: boolean;
    id: number | null;
}

interface IFormProps {
    loading: boolean;
    useSnackbar: {
        msg: string;
        is_open: boolean;
        state: string;
    };
    closeSnackbar(): void;
    formData: IForm;
    handleRoleChange(
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ): void;
    handleBranchChange(
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ): void;
    onSubmit(e: FormEvent): void;
}

function AddUserPBranch({
    loading,
    useSnackbar,
    closeSnackbar,
    formData,
    handleBranchChange,
    handleRoleChange,
    onSubmit,
}: IFormProps) {
    const [branches, setBranches] = useState<Array<object>>([]);

    const LoadBranches = async () => {
        // Making a GET request to retrieve branch data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_branches",
                }),
            )
            .then((Response: AxiosResponse) => {
                // Setting the retrieved data to the 'rows' state
                setBranches(Response.data);
            });
    };

    useEffect(() => {
        LoadBranches();
    }, []);

    return (
        <>
            <form onSubmit={onSubmit} style={{ height: "11vh" }}>
                <Grid spacing={2} container sx={{ flexGrow: 1 }}>
                    <Grid md={6}>
                        <Select
                            value={formData.branch}
                            placeholder="څانګه انتخاب"
                            onChange={handleBranchChange}
                            required
                        >
                            {branches.map((branch: any, index: number) => (
                                <Option value={branch.id} key={index}>
                                    {branch.name}
                                </Option>
                            ))}
                        </Select>
                    </Grid>
                    <Grid md={6}>
                        <Select
                            value={formData.role}
                            onChange={handleRoleChange}
                            placeholder="رول انتخاب"
                            required
                        >
                            <Option value={"admin"}>اډمین</Option>
                            <Option value={"accountant"}>منشي</Option>
                            <Option value={"normal"}>عادي</Option>
                        </Select>
                    </Grid>
                    <Grid md={12}>
                        <Button
                            variant={formData.is_update ? "soft" : "solid"}
                            type="submit"
                            loading={loading}
                            fullWidth
                        >
                            {formData.is_update ? "تغیر" : "ثبت"}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Snackbar
                variant="solid"
                color={useSnackbar.state as ColorPaletteProp}
                autoHideDuration={3000}
                open={useSnackbar.is_open}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={closeSnackbar}
            >
                {useSnackbar.msg}
            </Snackbar>
        </>
    );
}

export default AddUserPBranch;
