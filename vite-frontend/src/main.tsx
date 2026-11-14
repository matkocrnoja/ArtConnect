import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './Rute';

// MSW presreće zahtjeve portfolija (/me/...) dok backend nije gotov, ostali zahtjevi idu na pravi backend.
// iskljuciti ga s VITE_MSW=false u .env.local kad endpointi prorade
async function pokreniMock() {
  if (!import.meta.env.DEV || import.meta.env.VITE_MSW === 'false') return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass' });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  pokreniMock().then(() => {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  });
} else {
  console.error("Root element not found");
}