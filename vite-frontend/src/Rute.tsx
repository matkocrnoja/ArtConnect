import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './Stranice/Home';
import ShowNumber from './Stranice/ShowNumber';
import DashboardShell from './Stranice/DashboardShell';
import ProtectedRoute from './Komponente/ProtectedRoute';
import Vilim from './Stranice/OsobneStranice/Vilim';
import Matko from './Stranice/OsobneStranice/Matko';
import Ana from './Stranice/OsobneStranice/Ana';
import Leon from './Stranice/OsobneStranice/Leon';
import Luka from './Stranice/OsobneStranice/Luka';
import Borna from './Stranice/OsobneStranice/Borna';

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
        path: '/vilim',
        element: <Vilim />,
      },
      {
        path: '/matko',
        element: <Matko />,
      },
      {
        path: '/ana',
        element: <Ana />,
      },
      {
        path: '/leon',
        element: <Leon />,
      },
      {
        path: '/luka',
        element: <Luka />,
      },
      {
        path: '/borna',
        element: <Borna />,
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
      }
    ]}
]);

export default Rute;