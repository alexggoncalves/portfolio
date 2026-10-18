import { Link, useLocation } from "react-router";


import { useMemo } from "react";
import { CloseIcon } from "../general/Icons";
import useSceneStore from "../../../stores/sceneStore";

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
            {isMobile && (
                <Link
                    to={backPath}
                    className={`button button--icon project-close ${!open ? "open" : ""}`}
                >
                    <CloseIcon />
                </Link>
            )}
        </>
    );
}

export default ReturnButton;
