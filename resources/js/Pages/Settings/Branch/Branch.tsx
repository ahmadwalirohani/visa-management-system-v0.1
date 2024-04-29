import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import AddBranch from "./Partials/AddBranch";
import ViewBranch from "./Partials/ViewBranch";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ValidateNativeForm } from "@/Utils/Validation";
import { SendActionRequest, SendResourceRequest } from "@/Utils/helpers";
import axios, { AxiosResponse } from "axios";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";
import axiosInstance from "@/Pages/Plugins/axiosIns";

interface IBranchFields {
    name: string;
    admin: string;
    address: string;
    id: number;
    status: number;
}

export default function Branch() {
    const { privileges } = useUserBranchesContext();
    // State to manage form validation
    const [useFormValidation, setFormValidation] = useState({
        name: {
            state: false,
            msg: "",
        },
        address: {
            state: false,
            msg: "",
        },
        admin: {
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

    // Function to load branches asynchronously from the server
    const LoadBranches = async () => {
        setFetchLoading(true);

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
                setRows(Response.data);
            })
            .finally(() => setFetchLoading(false));
    };

    // State to manage form actions base states
    const [useFormFunctionalInfo, setFormFunctionalInfo] = useState({
        loading: false,
        is_update: false,
        branch_id: 0,
    });

    // Ref to reference the HTML form element
    const formRef = useRef<HTMLFormElement | null>(null);

    // Function to handle form submission
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validating the form using a utility function
        ValidateNativeForm(e.currentTarget, ["name", "address", "admin"])
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
                        _class: "SettingsLogics",
                        _method_name: "add_branch",
                        _validation_class: "branch",
                    },
                    Object.assign({}, validated.payload, useFormFunctionalInfo),
                );

                // Making a POST request to submit the form data
                axiosInstance
                    .post(Config.url, Config.payload)
                    .then((): any => {
                        // Handling success by updating the Snackbar state and resetting the form
                        setSnackbar({
                            msg: "څانګه په بریالي سره ثبت سول",
                            state: "success",
                            is_open: true,
                        });

                        resetForm(); // Resetting the form
                        LoadBranches(); // Reloading branches after successful submission
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

    // State to manage loading state during branch data fetching
    const [fetchLoading, setFetchLoading] = useState(true);

    // useEffect hook to load branches when the component mounts
    useEffect(() => {
        LoadBranches();
    }, []);

    const editBranch = (branch: IBranchFields): void => {
        (
            formRef.current?.elements.namedItem("name") as HTMLInputElement
        ).value = branch.name;

        (
            formRef.current?.elements.namedItem("admin") as HTMLInputElement
        ).value = branch.admin;

        (
            formRef.current?.elements.namedItem("address") as HTMLInputElement
        ).value = branch.address;

        setFormFunctionalInfo({
            is_update: true,
            loading: false,
            branch_id: branch.id,
        });
    };

    const resetForm = (): void => {
        formRef.current?.reset();
        setFormFunctionalInfo({
            loading: false,
            is_update: false,
            branch_id: 0,
        });
    };

    const changeBranchStatus = (branch: IBranchFields): void => {
        setFetchLoading(true);

        axiosInstance
            .post("change_resource_status", {
                id: branch.id,
                model: "Branch",
                status: branch.status,
            })
            .then((): void => {
                setSnackbar({
                    msg: `څانګه په بریالي سره ${branch.status ? "غیري فعاله" : "فعاله"} سول`,
                    state: "success",
                    is_open: true,
                });
                LoadBranches();
            })
            .finally(() => setFetchLoading(false));
    };

    const changeBranchToMain = (branch_id: number): void => {
        setFetchLoading(true);

        const Config = SendActionRequest(
            {
                _class: "SettingsLogics",
                _method_name: "set_branch_to_main",
                _validation_class: null,
            },
            {
                branch_id,
            },
        );

        axiosInstance
            .post(Config.url, Config.payload)
            .then(() => {
                setSnackbar({
                    msg: `څانګه په بریالي سره د عمومي په حیث سول`,
                    state: "success",
                    is_open: true,
                });
                LoadBranches();
            })
            .finally(() => setFetchLoading(false));
    };

    return (
        <Grid container spacing={2}>
            <Grid xs={4} md={4} sm={12}>
                {privileges.settings.branches.add && (
                    <AddBranch
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
                    />
                )}
            </Grid>
            <Grid xs={8} md={8} sm={12}>
                <Sheet sx={{ height: "65vh", overflow: "auto" }}>
                    {privileges.settings.branches.list && (
                        <ViewBranch
                            editBranch={editBranch}
                            fetchLoading={fetchLoading}
                            branches={rows}
                            changeStatus={changeBranchStatus}
                            changeToMain={changeBranchToMain}
                        />
                    )}
                </Sheet>
            </Grid>
        </Grid>
    );
}
