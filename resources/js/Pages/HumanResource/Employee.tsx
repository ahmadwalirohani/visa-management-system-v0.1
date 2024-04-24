import { Box, Card, Grid } from "@mui/joy";

import { Head } from "@inertiajs/react";
import AddEmployee from "./Partials/AddEmployee";
import ViewEmployee from "./Partials/ViewEmployee";

import { createContext, useContext, useState } from "react";
import { useUserBranchesContext } from "@/Layouts/SysDefaultLayout";

// Define the context
interface EventEmitterContextType {
    emitEvent: (eventName: string, eventData?: any) => void;
    addEventListener: (
        eventName: string,
        listener: (eventData?: any) => void,
    ) => void;
}

const EventEmitterContext = createContext<EventEmitterContextType | undefined>(
    undefined,
);

// Define a hook to access the context
export const useEventEmitter = () => {
    const context = useContext(EventEmitterContext);

    if (!context) {
        throw new Error(
            "useEventEmitter must be used within an EventEmitterProvider",
        );
    }

    return context;
};

function Employee() {
    const { privileges } = useUserBranchesContext();
    const [eventListeners, setEventListeners] = useState<{
        [eventName: string]: Array<(eventData?: any) => void>;
    }>({});

    const emitEvent = (eventName: string, eventData?: any) => {
        const listeners = eventListeners[eventName] || [];
        listeners.forEach((listener) => listener(eventData));
    };

    const addEventListener = (
        eventName: string,
        listener: (eventData?: any) => void,
    ) => {
        setEventListeners((prevListeners) => ({
            ...prevListeners,
            [eventName]: [...(prevListeners[eventName] || []), listener],
        }));
    };

    const contextValue: EventEmitterContextType = {
        emitEvent,
        addEventListener,
    };

    return (
        <EventEmitterContext.Provider value={contextValue}>
            <>
                <Head title="کارمندان" />
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        pt: { xs: "calc(12px + var(--Header-height))", md: 5 },
                        pb: { xs: 2, sm: 2, md: 1 },
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
                            <Box
                                sx={{
                                    height: "78vh",
                                }}
                            >
                                <Grid container spacing={2}>
                                    {privileges.employee.actions.add && (
                                        <AddEmployee />
                                    )}
                                    {privileges.employee.reports.list && (
                                        <ViewEmployee />
                                    )}
                                </Grid>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </>
        </EventEmitterContext.Provider>
    );
}

export default Employee;
