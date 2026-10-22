import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./pages/LayoutRoot";


// ROUTES
const router = createBrowserRouter([
    {
        element: <LayoutRoot />,
        children: [
            { path: "/", element: null },
            { path: "/contact", element: null },
            { path: "/work", element: null },
            { path: "/:projectId", element: null },
            { path: "/work/:projectId", element: null },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />
}

export default App;
