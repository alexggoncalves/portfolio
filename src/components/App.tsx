import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot";
import { imagesToPreload } from "../data/content";
import useImagePreloader from "../hooks/useImagePreloader";
import useSceneStore from "../stores/sceneStore";
// import LoadingScreen from "./layout/general/LoadingScreen";
import ComingSoon from "./layout/general/ComingSoon";

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
    const { loaded: imagesLoaded, progress: _imgProgress } =
        useImagePreloader(imagesToPreload);
    const setIsLoaded = useSceneStore((s) => s.setIsLoaded);

    useEffect(() => {
        if (imagesLoaded) setIsLoaded(true);
    }, [imagesLoaded, setIsLoaded]);

    return (
        <>
            {/* <LoadingScreen progress={imgProgress}></LoadingScreen> */}
            <ComingSoon></ComingSoon>

            <RouterProvider router={router} />
        </>
    );
}

export default App;
