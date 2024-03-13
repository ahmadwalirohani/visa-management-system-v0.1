import {
    createContext,
    useContext,
    FC,
    useState,
    PropsWithChildren,
} from "react";

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

// Define the provider component
export const EventEmitterProvider: FC = ({
    children,
    ...rest
}: PropsWithChildren) => {
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
        <EventEmitterContext.Provider value={contextValue} {...rest}>
            {children}
        </EventEmitterContext.Provider>
    );
};

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
