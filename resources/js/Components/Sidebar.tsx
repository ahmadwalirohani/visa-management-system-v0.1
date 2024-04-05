import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import { closeSidebar } from "@/Utils/utils";
import { Link } from "@inertiajs/react";
import ColorSchemeToggle from "./ColorSchemeToggle";
function Toggler({
    defaultExpanded = false,
    renderToggle,
    children,
}: {
    defaultExpanded?: boolean;
    children: React.ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }) => React.ReactNode;
}) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({ open, setOpen })}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "0.2s ease",
                    "& > *": {
                        overflow: "hidden",
                    },
                }}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}

export default function Sidebar({ user }: any) {
    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: "fixed", md: "sticky" },
                transform: {
                    xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
                    md: "none",
                },
                transition: "transform 0.4s, width 0.4s",
                zIndex: 10,
                height: "100dvh",
                width: "var(--Sidebar-width)",
                top: 0,
                p: 2,
                flexShrink: 0,
                display: "flex",
                boxShadow: "sm",
                flexDirection: "column",
                gap: 2,
                borderRight: "1px solid",
                borderColor: "divider",
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ":root": {
                        "--Sidebar-width": "220px",
                        [theme.breakpoints.up("lg")]: {
                            "--Sidebar-width": "240px",
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: "fixed",
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    opacity: "var(--SideNavigation-slideIn)",
                    backgroundColor: "var(--joy-palette-background-backdrop)",
                    transition: "opacity 0.4s",
                    transform: {
                        xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
                        lg: "translateX(-100%)",
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <IconButton variant="soft" color="primary" size="sm">
                    <BrightnessAutoRoundedIcon />
                </IconButton>
                <Typography level="title-lg">ویزي سیسټم</Typography>
                <ColorSchemeToggle sx={{ ml: "auto" }} />
            </Box>

            <Box
                sx={{
                    minHeight: 0,
                    overflow: "hidden auto",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 1,
                        "--List-nestedInsetStart": "30px",
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                    }}
                >
                    <ListItem>
                        <Link
                            href={route("dashboard")}
                            style={{ width: "100%", textDecoration: "none" }}
                        >
                            <ListItemButton
                                selected={route().current() == "dashboard"}
                            >
                                <DashboardRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        ډاشبورډ
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </Link>
                    </ListItem>

                    <ListItem>
                        <Link
                            href={route("visa.add")}
                            style={{ width: "100%", textDecoration: "none" }}
                        >
                            <ListItemButton
                                selected={route().current() == "visa.add"}
                            >
                                <ShoppingCartRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        ویزي ثبت
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href={route("visa.pending")}
                            style={{ width: "100%", textDecoration: "none" }}
                        >
                            <ListItemButton
                                role="menuitem"
                                component="a"
                                selected={route().current() == "visa.pending"}
                                //   href="/joy-ui/getting-started/templates/messages/"
                            >
                                <QuestionAnswerRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        معطلي ویزي
                                    </Typography>
                                </ListItemContent>
                                <Chip size="sm" color="primary" variant="solid">
                                    4
                                </Chip>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link
                            href={route("visa.process")}
                            style={{ width: "100%", textDecoration: "none" }}
                        >
                            <ListItemButton
                                selected={route().current() == "visa.process"}
                            >
                                <ShoppingCartRoundedIcon />
                                <ListItemContent>
                                    <Typography level="title-sm">
                                        ویزي جاري
                                    </Typography>
                                </ListItemContent>
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton
                                    selected={
                                        /\bhuman_resource\b/i.test(
                                            route().current() as string,
                                        ) == true
                                    }
                                    onClick={() => setOpen(!open)}
                                >
                                    <AssignmentRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            اشخاص
                                        </Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            transform: open
                                                ? "rotate(180deg)"
                                                : "none",
                                        }}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <Link
                                        href={route("human_resource.customer")}
                                        style={{
                                            width: "100%",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "human_resource.customer"
                                            }
                                        >
                                            مشتري
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <Link
                                        href={route("human_resource.employee")}
                                        style={{
                                            width: "100%",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "human_resource.employee"
                                            }
                                        >
                                            کارمند
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href={route(
                                            "human_resource.customer_ledger",
                                        )}
                                        style={{
                                            width: "100%",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "human_resource.customer_ledger"
                                            }
                                        >
                                            مشتري کهاته
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        کارمند کهاته
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                    <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton
                                    selected={
                                        /\bfinancial\b/i.test(
                                            route().current() as string,
                                        ) == true
                                    }
                                    onClick={() => setOpen(!open)}
                                >
                                    <AssignmentRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            مالي چاري
                                        </Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            transform: open
                                                ? "rotate(180deg)"
                                                : "none",
                                        }}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <Link
                                        href={route("financial.journal_entry")}
                                        style={{
                                            width: "100%",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "financial.journal_entry"
                                            }
                                        >
                                            روزنامچه رسول
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href={route("financial.tills")}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "financial.tills"
                                            }
                                        >
                                            دخل / تجري
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href={route("financial.banks")}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "financial.banks"
                                            }
                                        >
                                            بانک / صرافي
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>

                    <ListItem nested>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton
                                    selected={
                                        /\breports\b/i.test(
                                            route().current() as string,
                                        ) == true
                                    }
                                    onClick={() => setOpen(!open)}
                                >
                                    <GroupRoundedIcon />
                                    <ListItemContent>
                                        <Typography level="title-sm">
                                            راپورونه
                                        </Typography>
                                    </ListItemContent>
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            transform: open
                                                ? "rotate(180deg)"
                                                : "none",
                                        }}
                                    />
                                </ListItemButton>
                            )}
                        >
                            <List sx={{ gap: 0.5 }}>
                                <ListItem sx={{ mt: 0.5 }}>
                                    <Link
                                        href={route("reports.bank_ledger")}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemButton
                                            role="menuitem"
                                            component="a"
                                            selected={
                                                route().current() ==
                                                "reports.till_ledger"
                                            }
                                        >
                                            دخل کهاته
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href={route("reports.till_ledger")}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "reports.till_ledger"
                                            }
                                        >
                                            صرافي کهاته
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        کنسل ویزو راپور
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        تسلیم ویزو راپور
                                    </ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <Link
                                        href={route(
                                            "reports.proceed_visa_report",
                                        )}
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemButton
                                            selected={
                                                route().current() ==
                                                "reports.proceed_visa_report"
                                            }
                                        >
                                            جاري ویزو راپور
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>پورونه</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>بیلانس شیټ</ListItemButton>
                                </ListItem>
                                <ListItem>
                                    <ListItemButton>
                                        عاید او مصارف کهاته
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Toggler>
                    </ListItem>
                </List>

                <List
                    size="sm"
                    sx={{
                        mt: "auto",
                        flexGrow: 0,
                        "--ListItem-radius": (theme) => theme.vars.radius.sm,
                        "--List-gap": "8px",
                        mb: 2,
                    }}
                >
                    <ListItem>
                        <Link
                            href={route("settings")}
                            style={{ width: "100%", textDecoration: "none" }}
                        >
                            <ListItemButton
                                selected={route().current() == "settings"}
                            >
                                <SettingsRoundedIcon />
                                تنظیمات
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Avatar
                    variant="outlined"
                    size="sm"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography level="title-sm">{user.name}</Typography>
                    <Typography level="body-xs"> {user.email} </Typography>
                </Box>
                <Link href={route("logout")} method="post" as="button">
                    <IconButton size="sm" variant="plain" color="neutral">
                        <LogoutRoundedIcon />
                    </IconButton>
                </Link>
            </Box>
        </Sheet>
    );
}
