import "./styles/css/index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./components/app/App.tsx";
import ErrorElement from "./components/app/ErrorElement.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "projects",
                children: [
                    {
                        index: true,
                        element: <></>,
                    },
                    {
                        path: ":project_title",
                        element: <></>,
                    },
                ],
            },
            {
                path: "contacts",
                element: <></>,
            },
            {
                path: "more",
                element: <></>,
            },
        ],
        errorElement: <ErrorElement />,
    },
    {
        path: "/mobile",
        element: (
            <h1 className="temp_text">
                ... mobile version under construction ...
            </h1>
        ),
    },
    {
        path: "*",
        element: <ErrorElement />,
    },
]);

const root = document.getElementById("root");

if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>,
);
