import Box from "@mui/joy/Box";

import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Card from "@mui/joy/Card";
import User from "./User/User";
import Branch from "./Branch/Branch";
import Currency from "./Currency/Currency";
import EICode from "./EICode/EICode";
import { Head } from "@inertiajs/react";
import VisaType from "./VisaType/VisaType";
import SystemInfo from "./SystemInfo/SystemInfo";

function Settings() {
    return (
        <>
            <Head title="تنظیمات" />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    pt: { xs: "calc(12px + var(--Header-height))", md: 5 },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    height: "100dvh",
                    gap: 1,
                    overflow: "auto",
                }}
            >
                <Card sx={{ flex: 1, width: "100%" }}>
                    <Box
                        sx={{
                            position: "sticky",
                            top: { md: 5 },
                            bgcolor: "background.body",
                        }}
                    >
                        <Box sx={{ px: { xs: 2, md: 6 } }}>
                            <Typography
                                level="h3"
                                component="h1"
                                sx={{ mt: 0, mb: 0 }}
                            >
                                سیسټم تنظیمات
                            </Typography>
                        </Box>
                        <Tabs
                            defaultValue={0}
                            sx={{
                                bgcolor: "transparent",
                            }}
                        >
                            <TabList
                                tabFlex={1}
                                size="sm"
                                sx={{
                                    pl: { xs: 0, md: 4 },
                                    justifyContent: "center",
                                    [`&& .${tabClasses.root}`]: {
                                        fontWeight: "600",
                                        flex: "initial",
                                        color: "text.tertiary",
                                        [`&.${tabClasses.selected}`]: {
                                            bgcolor: "transparent",
                                            color: "text.primary",
                                            "&::after": {
                                                height: "2px",
                                                bgcolor: "primary.500",
                                            },
                                        },
                                    },
                                }}
                            >
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={0}
                                >
                                    یوزران
                                </Tab>
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={1}
                                >
                                    اسعار
                                </Tab>
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={2}
                                >
                                    سیسټم معلومات
                                </Tab>
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={3}
                                >
                                    څانګي
                                </Tab>
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={5}
                                >
                                    ویزو ډولونه
                                </Tab>
                                <Tab
                                    sx={{ borderRadius: "6px 6px 0 0" }}
                                    indicatorInset
                                    value={4}
                                >
                                    عایدو او مصارفو کوډونه
                                </Tab>
                            </TabList>
                            <TabPanel value={0}>
                                <User></User>
                            </TabPanel>
                            <TabPanel value={1}>
                                <Currency />
                            </TabPanel>
                            <TabPanel value={2}>
                                <SystemInfo />
                            </TabPanel>
                            <TabPanel value={3}>
                                <Branch></Branch>
                            </TabPanel>
                            <TabPanel value={4}>
                                <EICode />
                            </TabPanel>
                            <TabPanel value={5}>
                                <VisaType />
                            </TabPanel>
                        </Tabs>
                    </Box>
                </Card>
            </Box>
        </>
    );
}

export default Settings;
