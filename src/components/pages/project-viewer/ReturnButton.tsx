import { Link, useLocation, useNavigate } from "react-router";

import { useEffect} from "react";
import { ReturnIcon } from "../../general/Icons";

function ReturnButton({ enabled }: { enabled: boolean }) {
    const location = useLocation();
    const navigate = useNavigate();

    const backPath = location.pathname.startsWith("/work/") ? "/work" : "/";

    useEffect(() => {
        if (!enabled) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Escape" || e.defaultPrevented) return;

            // Ignore escape when in fullscreen
            if (document.fullscreenElement) return;

            navigate(backPath);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [enabled, backPath, navigate]);

    return (
        <>
            <Link
                to={backPath}
                className={`project-viewer__return button--glass`}
            >
                <ReturnIcon /> 
                Return
            </Link>
        </>
    );
}

export default ReturnButton;
