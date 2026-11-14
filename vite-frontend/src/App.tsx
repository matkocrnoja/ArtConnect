// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Outlet } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

export default function App() {
    return (
        <MantineProvider>
            <Notifications />
            <Outlet />
        </MantineProvider>
    );
}
