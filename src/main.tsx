import "./styles/index.scss"
import "./components/ui/Buttons.scss"
import "./components/ui/Window.scss"

import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, redirect, type LoaderFunctionArgs, RouterProvider } from "react-router";

import { projectExists } from "./data/content.ts";

import App from "./components/App.tsx";
import HomePage from "./components/pages/homepage/HomePage.tsx";
import ProjectsGridPage from "./components/pages/projects-grid/ProjectsGridPage.tsx";
import ContactsPage from "./components/pages/contacts/ContactsPage.tsx";

// Redirect invalid project ids to the page they were opened from
const validateProject = (fallback: string) =>
    ({ params }: LoaderFunctionArgs) => projectExists(params.projectId) ? null : redirect(fallback);

history.scrollRestoration = "manual";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />,
                children: [{ path: ":projectId", loader: validateProject("/") }],
            },
            {
                path: "/work",
                element: <ProjectsGridPage />,
                children: [{ path: ":projectId", loader: validateProject("/work") },],
            },
            {
                path: "/contact",
                element: <ContactsPage />
            }
        ]
    }
]);

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
