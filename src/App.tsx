import "./styles/css/App.css";

import ErrorElement from "./components/SceneHandler/ErrorElement";

import { Outlet, useRouteError } from "react-router";
import { useEffect, useState } from "react";

import SceneHandler from "./components/SceneHandler/SceneHandler";
import useSceneStore from "./stores/sceneStore";
import useAsciiStore from "./stores/asciiStore";
import useWorkStore from "./stores/contentStore";

function App() {
    const error = useRouteError();

    const [showError, setShowError] = useState(false);

    const { setIsMobile } = useSceneStore();
    const { canvasSize } = useAsciiStore();

    const { loadWork } = useWorkStore();

    // Detect mobile screen size
    useEffect(() => {
        if (window.innerWidth < 600) setIsMobile(true);
        else setIsMobile(false)
    }, [canvasSize.x, canvasSize.y]);

    // 
    useEffect(() => {
        if (error) {
            setShowError(true);
            console.error("Route error:", error);
        } else {
            setShowError(false);
        }
    }, [error, location]);

    useEffect(()=>{
        loadWork(); 
    },[])

    return (
        <>
            <SceneHandler />
            
            <div id="dom-overlay">
                <header></header>
                <main></main>
            </div>

            {showError ? <ErrorElement /> : <Outlet />}
        </>
    );
}

export default App;
