import "./styles/css/index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App.tsx";
import ErrorElement from "./components/SceneHandler/ErrorElement.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        // errorElement: <ErrorElement/>,
        children: [
            {
                path: "work",
                children: [
                  {
                    index: true,
                    element: <h1 className="temp_text"> work</h1>
                  },
                  {
                    path: ":project_title",
                    element: <h1 className="temp_text"> work #x </h1>
                  }
                ]
            },
            {
                path: "contacts",
                element: <h1 className="temp_text">contacts</h1>,
            },
            {
                path: "more",
                element: <h1 className="temp_text">more</h1>,
            },
            {
                path: "*",
                element: <ErrorElement/>,
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

ReactDOM.createRoot(root!).render(<RouterProvider router={router} />);
