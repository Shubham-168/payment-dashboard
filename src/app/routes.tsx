import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import PaymentHistory from "@/pages/PaymentHistory";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <PaymentHistory /> },
            // { path: "payment-history", element: <PaymentHistory /> },
            { path: "dashboard", element: <Dashboard /> },
            { path: "users", element: <Users /> },
        ],
    },
]);
