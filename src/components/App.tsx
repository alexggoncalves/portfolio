import { Outlet, useLocation, useParams } from "react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { PerspectiveCamera, View } from "@react-three/drei";

import useImagePreloader from "../hooks/useImagePreloader";
import { imagesToPreload } from "../data/content";

import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import ProjectViewer from "./pages/project-viewer/ProjectViewer";
import Footer from "./Footer";
import { Canvas } from "@react-three/fiber";
import StarrySkyScene from "./general/StarrySkyScene";

const App = () => {
    const { pathname } = useLocation();
    const { projectId } = useParams();
    const { loaded, progress } = useImagePreloader(imagesToPreload);

    const [visibleProject, setVisibleProject] = useState<string | null>(null);


    useEffect(() => {
        if (projectId) {
            setVisibleProject(projectId);
            return;
        }
        const timeout = setTimeout(() => setVisibleProject(null), 400);
        return () => clearTimeout(timeout);
    }, [projectId]);

    const section = pathname.startsWith("/work") ? "work" : pathname === "/contact" ? "contact" : "home";
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [section, loaded]);

    return (
        <>
            <LoadingScreen progress={progress} />

            <Canvas
                className="app-canvas"
                eventSource={document.getElementById("root")!}
            >
                <View.Port />
            </Canvas>

            <Header />

            <StarrySkyScene/>

            {loaded && (
                <main>
                    
                    <Outlet />
                    {visibleProject && (
                        <ProjectViewer projectId={visibleProject} isOpen={!!projectId} />
                    )}

                </main>
            )}

            {section !== "work" && <Footer />}
        </>
    );
}

export default App;
