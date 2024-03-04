import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { StyledEngineProvider } from "@mui/joy/styles";
import SysDefaultLayout from "./Layouts/SysDefaultLayout";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // const page = resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx'));
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        const page: any = pages[`./Pages/${name}.tsx`];
        if (name != "Auth/Login") {
            page.default.layout =
                page.default.layout ||
                ((page: any) => (
                    <SysDefaultLayout user={page.props.auth.user}>
                        {page}
                    </SysDefaultLayout>
                ));
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StyledEngineProvider injectFirst>
                <App {...props} />
            </StyledEngineProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
