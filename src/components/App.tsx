import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot";
import { imagesToPreload } from "../data/content";
import useImagePreloader from "../hooks/useImagePreloader";
import LoadingScreen from "./layout/general/LoadingScreen";

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
    const { loaded: _imagesLoaded, progress: imgProgress } =
        useImagePreloader(imagesToPreload);

    return (
        <>
            <LoadingScreen progress={imgProgress}></LoadingScreen>

            <RouterProvider router={router} />
        </>
    );
}

export default App;
