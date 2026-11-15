import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router";

const SECTION_TITLES = {
    home: "Alex - Creative Developer",
    work: "Alex - Work",
    contact: "Alex - Contacts",
};
export type Section = keyof typeof SECTION_TITLES;

const useSection = () => {
    const { pathname } = useLocation();
    const section: Section = pathname.startsWith("/work")
        ? "work"
        : pathname === "/contact"
          ? "contact"
          : "home";

    useEffect(() => {
        document.title = SECTION_TITLES[section];
    }, [section]);

    // Fade the new page in once it has rendered
    useLayoutEffect(() => {
        document.documentElement.classList.remove("page-leaving");
    }, [pathname]);

    return section;
}

export default useSection;