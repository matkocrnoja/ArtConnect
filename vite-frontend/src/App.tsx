// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { DatesProvider } from "@mantine/dates";
import "dayjs/locale/hr";
import { Outlet } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

export default function App() {
  return (
    <MantineProvider>
      <DatesProvider settings={{ locale: "hr" }}>
        <Notifications />
        <Outlet />
      </DatesProvider>
    </MantineProvider>
  );
}
