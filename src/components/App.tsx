import { useEffect } from "react";

import useAssetStore from "./asset-handling/assetStore";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot";
import AsciiStage from "./ascii/AsciiStage";

const router = createBrowserRouter([
    {
        element: <LayoutRoot />,
        children: [
            { path: "/", element: null },
            { path: "/contact", element: null },
            { path: "/projects", element: null },
            { path: "/:projectId", element: null },
            { path: "/projects/:projectId", element: null },
        ],
    },
]);

function App() {
    const loadGlobalAssets = useAssetStore((state) => state.loadGlobalAssets);

    useEffect(() => {
        loadGlobalAssets();
    }, [loadGlobalAssets]);

    return (
        <>
            {/* Main Layout */}
            <RouterProvider router={router} />

            {/* Ascii Overlay */}
            <AsciiStage />
        </>
    );
}

export default App;
