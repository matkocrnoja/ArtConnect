import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Outlet } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
    return (
        <MantineProvider>
            <Notifications />
            <ModalsProvider>
                <Outlet />
            </ModalsProvider>
        </MantineProvider>
    );
}
