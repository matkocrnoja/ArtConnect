import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ShowNumber from "./Stranice/ShowNumber";
import DashboardShell from "./Stranice/DashboardShell";
import ProtectedRoute from "./Komponente/ProtectedRoute";
import Registracija from "./Stranice/Registracija";
import Prijava from "./Stranice/Prijava";
import Home from "./Stranice/Home/Home";
import TestUpload from "./Stranice/TestUpload";
import MojePrilike from "./Stranice/MojePrilike/MojePrilike";

const Rute = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/prikazi-broj/:id?",
                element: <ShowNumber />,
            },
            {
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <DashboardShell />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/registracija",
                element: <Registracija />,
            },
            {
                path: "/prijava",
                element: <Prijava />,
            },
            {
                path: "/test-upload",
                element: (
                    <ProtectedRoute>
                        <TestUpload />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/moje-prilike",
                element: (
                    <ProtectedRoute requiredRole = "organizator">
                        <MojePrilike />
                    </ProtectedRoute>
                )
            }
        ],
    },
]);

export default Rute;
