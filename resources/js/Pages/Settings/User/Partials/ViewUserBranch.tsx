import {
    Alert,
    Chip,
    DialogContent,
    Dropdown,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    Modal,
    ModalClose,
    ModalDialog,
    ModalDialogProps,
    Sheet,
    Table,
} from "@mui/joy";
import MoreVert from "@mui/icons-material/MoreVert";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { FormEvent, useEffect, useState } from "react";
import AddUserPBranch from "./AddUserPBranch";
import axios, { AxiosResponse } from "axios";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ViewUserPrivileges from "./ViewUserPrivilege";

interface IUserInfo {
    id: number;
    name: string;
    email: string;
    privilege_branches: Array<object>;
}

interface IModalProps {
    setLayoutState(
        state: ModalDialogProps["layout"] | undefined,
        user: any,
    ): void;
    layout: undefined | any;
    userInfo: IUserInfo;
}

interface IForm {
    branch: string | null;
    role: string | null;
    id: number | null;
    is_update: boolean;
}

const resolveUserRole = ({ is_admin, is_accountant, is_normal }: any): any => {
    switch (true) {
        case is_admin == 1:
            return <Chip color="success">مدیر</Chip>;
        case is_accountant == 1:
            return <Chip color="primary">منشي</Chip>;
        case is_normal == 1:
            return <Chip color="neutral">عادي یوزر</Chip>;
    }
};

const resolveStatus = (status: number | boolean) => {
    if (status)
        return (
            <Chip variant="outlined" color="success">
                فعاله
            </Chip>
        );
    else
        return (
            <Chip variant="outlined" color="danger">
                غیري فعاله
            </Chip>
        );
};

function ViewUserBranch({ setLayoutState, layout, userInfo }: IModalProps) {
    const [userPrivilegeBranches, setPrivilegeBranches] = useState<
        Array<object>
    >([]);
    const [privilegesProps, setPrivilegesProps] = useState({
        layout: undefined,
        id: 0,
        name: "",
        email: "",
        branch: "",
        privileges: {},
    });

    const openPrivilegesDialog = (state: any): void => {
        setPrivilegesProps((prev) => ({
            ...prev,
            layout: state,
        }));
    };

    const LoadData = async (): Promise<void> => {
        axios
            .get(
                SendResourceRequest(
                    {
                        _class: "SettingsResources",
                        _method_name: "get_user_privilege_branches",
                    },
                    { userId: userInfo.id },
                ),
            )
            .then((Response: AxiosResponse): void => {
                setPrivilegeBranches([...Response.data]);
            });
    };

    const [loading, setLoading] = useState<boolean>(false);

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    const [formData, setFormData] = useState<IForm>({
        branch: "",
        role: "",
        id: 0,
        is_update: false,
    });

    const handleRoleChange = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            role: newValue,
        }));
    };

    const handleBranchChange = (
        event: React.SyntheticEvent | null,
        newValue: string | null,
    ) => {
        setFormData((prevState) => ({
            ...prevState,
            branch: newValue,
        }));
    };

    const onSubmit = (e: FormEvent): void => {
        e.preventDefault();

        const RConfig = SendActionRequest(
            {
                _class: "UsersLogics",
                _method_name: "add_user_to_branch",
                _validation_class: null,
            },
            {
                ...formData,
                userId: userInfo.id,
            },
        );
        setLoading(true);
        axios
            .post(RConfig.url, RConfig.payload)
            .then((Response: AxiosResponse): void => {
                setSnackbar({
                    msg: "یوزر په بریالي سره ثبت سول",
                    state: "success",
                    is_open: true,
                });

                setPrivilegeBranches([...Response.data]);

                setFormData({
                    branch: "",
                    role: "",
                    is_update: false,
                    id: 0,
                });
            })
            .catch((Error): void => {
                setSnackbar({
                    msg: Error?.response?.data?.message,
                    state: "danger",
                    is_open: true,
                });
            })
            .finally(() => setLoading(false));
    };

    const changeUserStatus = (id: number, status: number): void => {
        setLoading(true);

        axios
            .post("change_resource_status", {
                id,
                model: "UserPrivilegeBranch",
                status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `څانګه په بریالي سره ${status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });

                LoadData();
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        LoadData();

        setPrivilegesProps((prev) => ({
            ...prev,
            name: userInfo.name,
            email: userInfo.email,
        }));
    }, [userInfo]);

    return (
        <>
            <Modal
                open={!!layout}
                onClose={() => {
                    setLayoutState(undefined, {});
                }}
                dir="rtl"
            >
                <ModalDialog
                    maxWidth={400}
                    minWidth={400}
                    dir="rtl"
                    layout={layout}
                    sx={{
                        top: "50%",
                        height: "80vh",
                    }}
                >
                    <p style={{ fontSize: "small" }}>
                        یوزر په څانګو پوري مربوط کول
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
                        <Alert
                            variant="outlined"
                            color="neutral"
                            sx={{
                                marginBottom: 2,
                            }}
                            startDecorator={<AccountCircleRoundedIcon />}
                        >
                            {userInfo?.name} &nbsp;&nbsp;&nbsp; | &nbsp;{" "}
                            {userInfo?.email}
                        </Alert>

                        <AddUserPBranch
                            loading={loading}
                            formData={formData}
                            onSubmit={onSubmit}
                            useSnackbar={useSnackbar}
                            closeSnackbar={() =>
                                setSnackbar((prevState) => ({
                                    ...prevState,
                                    is_open: false,
                                }))
                            }
                            handleBranchChange={handleBranchChange}
                            handleRoleChange={handleRoleChange}
                        />

                        <Sheet>
                            <Table stickyFooter stickyHeader variant="soft">
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                textAlign: "left",
                                                width: 70,
                                            }}
                                        >
                                            ID
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                            }}
                                        >
                                            څانګه
                                        </th>
                                        <th
                                            style={{
                                                textAlign: "right",
                                                width: 150,
                                            }}
                                        >
                                            رول
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userPrivilegeBranches.map(
                                        (branch: any, index: number) => (
                                            <tr key={index}>
                                                <td>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <Dropdown>
                                                            <MenuButton
                                                                slots={{
                                                                    root: IconButton,
                                                                }}
                                                                slotProps={{
                                                                    root: {
                                                                        variant:
                                                                            "outlined",
                                                                        color: "neutral",
                                                                    },
                                                                }}
                                                            >
                                                                <MoreVert />
                                                            </MenuButton>
                                                            <Menu
                                                                placement="bottom-end"
                                                                sx={{
                                                                    zIndex: 10000,
                                                                }}
                                                            >
                                                                <MenuItem
                                                                    onClick={() =>
                                                                        setFormData(
                                                                            {
                                                                                id: branch.id,
                                                                                is_update:
                                                                                    true,
                                                                                branch: branch.branch_id,
                                                                                role: branch.is_admin
                                                                                    ? "admin"
                                                                                    : branch.is_accountant
                                                                                      ? "accountant"
                                                                                      : "noraml",
                                                                            },
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit />
                                                                    تغیر
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() =>
                                                                        changeUserStatus(
                                                                            branch.id,
                                                                            branch.status,
                                                                        )
                                                                    }
                                                                >
                                                                    {branch.status ==
                                                                        1 && (
                                                                        <VisibilityOff />
                                                                    )}
                                                                    {branch.status ==
                                                                        0 && (
                                                                        <Visibility />
                                                                    )}

                                                                    {branch.status
                                                                        ? "غیر فعال"
                                                                        : "فعال"}
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        openPrivilegesDialog(
                                                                            "center",
                                                                        );
                                                                        setPrivilegesProps(
                                                                            (
                                                                                prev,
                                                                            ) => ({
                                                                                ...prev,
                                                                                branch: branch
                                                                                    .branch
                                                                                    .name,
                                                                                id: branch.id,
                                                                                privileges:
                                                                                    JSON.parse(
                                                                                        branch.privileges,
                                                                                    ),
                                                                            }),
                                                                        );
                                                                    }}
                                                                >
                                                                    صلاحیتونه
                                                                </MenuItem>
                                                            </Menu>
                                                        </Dropdown>
                                                        <div>{branch.id}</div>
                                                    </div>
                                                </td>
                                                <td>{branch.branch?.name}</td>
                                                <td>
                                                    {resolveUserRole(branch)}
                                                    {resolveStatus(
                                                        branch.status,
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </Table>
                        </Sheet>
                    </DialogContent>
                </ModalDialog>
            </Modal>

            <ViewUserPrivileges
                infoProps={privilegesProps}
                setLayoutState={openPrivilegesDialog}
            />
        </>
    );
}

export default ViewUserBranch;
