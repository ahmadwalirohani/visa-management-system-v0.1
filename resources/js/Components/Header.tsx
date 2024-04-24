import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";

import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Option, Select } from "@mui/joy";
import { usePage } from "@inertiajs/react";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

export default function Header() {
    const { auth } = usePage().props;
    const { selectBranch, selectedBranch } = useUserBranchesContext();

    return (
        <Sheet
            sx={{
                display: { xs: "flex", md: "flex" },
                alignItems: "center",
                justifyContent: "space-between",
                position: "fixed",
                top: 0,
                right: "var(--Sidebar-width)",
                width: "100vw",
                height: "var(--Header-height)",
                p: 2,
                gap: 1,
                borderBottom: "1px solid",
                borderColor: "background.level1",
                boxShadow: "sm",
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ":root": {
                        "--Header-height": "52px",
                        [theme.breakpoints.up("md")]: {
                            "--Header-height": "52px",
                        },
                    },
                })}
            />
            {/* <IconButton
        onClick={() => toggleSidebar()}
        variant="outlined"
        color="neutral"
        size="sm"
      >
        <MenuIcon />
      </IconButton> */}
            <Sheet
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "80%",
                }}
            >
                <Input
                    size="sm"
                    startDecorator={<SearchRoundedIcon />}
                    placeholder="پلټنه ..."
                />

                <Select
                    size="sm"
                    onChange={(e: any, newValue: any) =>
                        selectBranch(newValue as number)
                    }
                    placeholder="Branch"
                    value={selectedBranch}
                >
                    {(
                        auth as {
                            user: {
                                privilege_branches: Array<any>;
                            };
                        }
                    ).user.privilege_branches.map(
                        (branch: any, index: number) => (
                            <Option value={branch.branch_id} key={index}>
                                {branch.branch.name}
                            </Option>
                        ),
                    )}
                </Select>
            </Sheet>
        </Sheet>
    );
}
