import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { IUserAuthorityControl, User } from "@/types";
import { usePage } from "@inertiajs/react";

interface UserBranchContextType {
    selectedBranch: number;
    selectBranch(branch: any): void;
    privileges: IUserAuthorityControl;
}

const UserBranchContext = createContext<UserBranchContextType | undefined>(
    undefined,
);

export const useUserBranchesContext = () => {
    const context = useContext(UserBranchContext);

    if (!context) {
        throw new Error("Userbranch must be in Provider");
    }
    return context;
};

export default function SysDefaultLayout({
    user,
    children,
}: PropsWithChildren<{ user: User }>) {
    const _PrivilegeBranches = (usePage().props.auth as any).user
        .privilege_branches as Array<any>;
    const [selectedBranch, selectBranch] = useState<any>(
        (usePage().props.auth as any).user.privilege_branches[0]
            .branch_id as number,
    );

    const [privileges, setPrivileges] = useState<IUserAuthorityControl>(
        JSON.parse(
            JSON.parse(
                (usePage().props.auth as any).user.privilege_branches[0]
                    .privileges,
            ),
        ) as IUserAuthorityControl,
    );

    useEffect(() => {
        const _p = JSON.parse(
            _PrivilegeBranches.filter((b) => b.branch_id == selectedBranch)[0]
                .privileges,
        );
        setPrivileges(JSON.parse(_p));
        localStorage.setItem("privileges", _p);
        localStorage.setItem("selectedBranch", selectedBranch);
    }, [selectedBranch]);

    const contextValue: UserBranchContextType = {
        selectedBranch,
        selectBranch,
        privileges,
    };

    return (
        <UserBranchContext.Provider value={contextValue}>
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline />
                <Box sx={{ display: "flex", minHeight: "100dvh" }}>
                    <Header />
                    <Sidebar user={user} />
                    <Box
                        component="main"
                        className="MainContent"
                        sx={{
                            px: { xs: 2, md: 1 },
                            pt: {
                                xs: "calc(12px + var(--Header-height))",
                                sm: "calc(12px + var(--Header-height))",
                                md: 3,
                            },
                            pb: { xs: 2, sm: 2, md: 2 },
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            minWidth: 0,
                            height: "100dvh",
                            gap: 1,
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </CssVarsProvider>
        </UserBranchContext.Provider>
    );
}
