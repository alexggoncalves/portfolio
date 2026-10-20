import { Link, useLocation } from "react-router";


import { useMemo } from "react";
import useSceneStore from "../../../stores/sceneStore";
import { ReturnIcon } from "../../interface/Icons";

function ReturnButton() {
    const isMobile = useSceneStore((s) => s.isMobile);

    // Back path
    const location = useLocation();
    const backPath = useMemo(() => {
        if (location.pathname.startsWith("/work/")) {
            return "/work";
        }

        if (location.pathname.startsWith("/")) {
            return "/";
        }

        return "/";
    }, [location.pathname]);

    return (
        <>
            <Link
                to={backPath}
                className={`project-viewer__return button--glass`}
            >
                <ReturnIcon/> RETURN
            </Link>
        </>
    );
}

export default ReturnButton;
