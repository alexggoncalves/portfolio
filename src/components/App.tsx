import { useEffect } from "react";

import useAssetStore from "../stores/assetStore";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot";
import AsciiStage from "./ascii/AsciiStage";
import useAsciiRenderStore from "../stores/asciiRenderStore";

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

    const isGridReady = useAsciiRenderStore((s) => s.isGridReady);
    const isAtlasReady = useAsciiRenderStore((s) => s.isAtlasReady);

    const ready = isGridReady && isAtlasReady;

    const bgColor = useAsciiRenderStore((s)=>s.bgColor)

    useEffect(() => {
        loadGlobalAssets();
    }, [loadGlobalAssets]);

    return (
        <>
            {/* Main Layout */}
            <RouterProvider router={router} />

            {/* Ascii Overlay */}
            <AsciiStage />

            {/* GLOBAL FADE CURTAIN */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: bgColor,
                    pointerEvents: "none",
                    opacity: ready ? 0 : 1,
                    transition: "opacity 700ms ease",
                    zIndex: 9999,
                }}
            />
        </>
    );
}

export default App;
