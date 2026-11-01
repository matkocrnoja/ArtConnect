import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Stranice/Home';
import ShowNumber from './Stranice/ShowNumber';
import DashboardShell from './Stranice/DashboardShell';
import ProtectedRoute from './Komponente/ProtectedRoute';
import Registracija from './Stranice/Registracija';

const Rute = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/prikazi-broj/:id?',
        element: <ShowNumber/>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute>
                  <DashboardShell />
                </ProtectedRoute>,
      },
      {
        path: '/registracija',
        element: <Registracija />,
      }
    ]}
]);

export default Rute;