import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddUser from "./Partials/AddUser";
import ViewUser from "./Partials/ViewUser";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { ValidateNativeForm } from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import axiosInstance from "@/Pages/Plugins/axiosIns";

interface IUserFields {
    name: string;
    email: string;
    password: string;
    id: number;
    status: number;
    image: string;
}

export default function User() {
    const { privileges } = useUserBranchesContext();

    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        email: {
            state: false,
            msg: "",
        },
        password: {
            state: false,
            msg: "",
        },
    });

    // State to manage Snackbar (notification)
    const [useSnackbar, setSnackbar] = useState({
        is_open: false,
        msg: "",
        state: "danger",
    });

    // Function to load users asynchronously from the server
    const Load = async () => {
        setFetchLoading(true);

        // Making a GET request to retrieve User data
        axios
            .get(
                SendResourceRequest({
                    _class: "SettingsResources",
                    _method_name: "get_users",
                }),
            )
            .then((Response: AxiosResponse) => {
                // Setting the retrieved data to the 'rows' state
                setRows(Response.data);
            })
            .finally(() => setFetchLoading(false));
    };

    // State to manage form actions base states
    const [useFormFunctionalInfo, setFormFunctionalInfo] = useState({
        loading: false,
        is_update: false,
        user_id: 0,
        image: "/user-avator.png",
    });

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fileInput = new FormData(e.currentTarget).get("image") as File;

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, ["name", "email", "password"])
            .then((validated) => {
                // Updating form validation state with validation results
                setFormValidation((prevState) => ({
                    ...prevState,
                    ...validated.validated_payload,
                }));

                // Setting loading state to true during form submission
                setFormFunctionalInfo((prevState) => ({
                    ...prevState,
                    loading: true,
                }));

                // Creating a configuration for sending an action request
                const Config = SendActionRequest(
                    {
                        _class: "UsersLogics",
                        _method_name: "create_user",
                        _validation_class: "CreateUser",
                    },
                    Object.assign(
                        {},
                        validated.payload,
                        {
                            image: fileInput,
                        },
                        useFormFunctionalInfo,
                    ),
                );

                // Making a POST request to submit the form data
                axiosInstance
                    .postForm(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "یوزر په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        Load(); // Reloading users after successful submission
                    })
                    .catch((Error): any => {
                        // Handling error by updating the Snackbar state with the error message
                        setSnackbar({
                            msg: Error.response.data.message,
                            state: "danger",
                            is_open: true,
                        });
                    })
                    .finally(() =>
                        setFormFunctionalInfo((prevState) => ({
                            ...prevState,
                            loading: false,
                        })),
                    ); // Setting loading state to false after form submission
            })
            .catch((errors) => {
                // Handling form validation errors by updating the form validation state
                setFormValidation((prevState) => ({
                    ...prevState,
                    ...errors,
                }));
            });
    };

    // State to manage the fetched rows of data
    const [rows, setRows] = useState<Array<object>>([]);

    // State to manage loading state during user data fetching
    const [fetchLoading, setFetchLoading] = useState(true);

    // useEffect hook to load users when the component mounts
    useEffect(() => {
        Load();
    }, []);

    const editUser = (user: IUserFields): void => {
        (
            formRef.current?.elements.namedItem("name") as HTMLInputElement
        ).value = user.name;

        (
            formRef.current?.elements.namedItem("email") as HTMLInputElement
        ).value = user.email;

        setFormFunctionalInfo({
            is_update: true,
            loading: false,
            user_id: user.id,
            image: user.image,
        });
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            user_id: 0,
            image: "/user-avator.png",
        });
    };

    const changeUserStatus = (user: IUserFields): void => {
        setFetchLoading(true);

        axiosInstance
            .post("change_resource_status", {
                id: user.id,
                model: "User",
                status: user.status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `یوزر په بریالي سره ${user.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                Load();
            })
            .finally(() => setFetchLoading(false));
    };

    const PreviewUploadImg = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormFunctionalInfo((prevState) => ({
                    ...prevState,
                    image: reader.result as string,
                }));
            };

            reader.readAsDataURL(file);
        }
    };
    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                {privileges.settings.users.add && (
                    <AddUser
                        useSnackbar={useSnackbar}
                        closeSnackbar={() =>
                            setSnackbar((prevState) => ({
                                ...prevState,
                                is_open: false,
                            }))
                        }
                        resetForm={resetForm}
                        formRef={formRef}
                        formInfo={useFormFunctionalInfo}
                        onSubmit={onSubmit}
                        formValidation={useFormValidation}
                        preImage={useFormFunctionalInfo.image}
                        onImageUpload={PreviewUploadImg}
                    />
                )}
            </Grid>
            <Grid xs={8} md={8} sm={12}>
                <Sheet sx={{ height: "65vh", overflow: "auto" }}>
                    {privileges.settings.users.list && (
                        <ViewUser
                            editUser={editUser}
                            fetchLoading={fetchLoading}
                            users={rows}
                            changeStatus={changeUserStatus}
                        />
                    )}
                </Sheet>
            </Grid>
        </Grid>
    );
}
