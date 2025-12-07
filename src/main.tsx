import "./styles/css/index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";
import ErrorElement from "./components/SceneHandler/ErrorElement.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // errorElement: <ErrorElement/>,
        children: [
            {
                path: "work",
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
            {
                path: "*",
                element: <ErrorElement />,
            },
        ],
    },
    {
        path: "/mobile",
        element: (
            <h1 className="temp_text">
                ... mobile version under construction ...
            </h1>
        ),
    },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
    // <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    // </StrictMode>
);
