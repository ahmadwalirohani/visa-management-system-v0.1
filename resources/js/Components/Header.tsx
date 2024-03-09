import GlobalStyles from "@mui/joy/GlobalStyles";
import Sheet from "@mui/joy/Sheet";

import Input from "@mui/joy/Input";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function Header() {
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
            <Input
                size="sm"
                startDecorator={<SearchRoundedIcon />}
                placeholder="پلټنه ..."
            />
        </Sheet>
    );
}
