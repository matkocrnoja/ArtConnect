// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { Outlet } from "react-router-dom";

import { MantineProvider } from '@mantine/core';

export default function App() {
  return (
    <MantineProvider>
      <Outlet/>
    </MantineProvider>
  );
}