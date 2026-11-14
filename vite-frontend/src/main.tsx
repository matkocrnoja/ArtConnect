import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Rute";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledFrame: "bypass",
  });
}

const rootElement = document.getElementById("root");
if (rootElement) {
  enableMocking().then(() => {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    );
  });
} else {
  console.error("Root element not found");
}
