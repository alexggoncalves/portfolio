import { useEffect, useRef} from "react";

import { useNavigate } from "react-router";
import { Navigation } from "../components/elements/Navigation";

//---------------------------------------------------------------------
// useNav (Hook): Initialize the navigation layer
//---------------------------------------------------------------------
function useNav(deps: any[]) {
    const navRef = useRef<Navigation | null>(null);

    const navigate = useNavigate();
    const goTo = (p: string) => navigate(p);

    const isMobile = false;

    useEffect(() => {
        // Create and initialize navigation layer
        if (!navRef.current) {
            navRef.current = new Navigation(goTo);
            navRef.current.init(isMobile);
        }

        // Destroy elements on component unmount
        return () => {
            navRef.current?.destroy();
            navRef.current = null;
        };
    }, deps);

    if (!navRef.current) return null;
    return navRef.current;
}

export default useNav;
