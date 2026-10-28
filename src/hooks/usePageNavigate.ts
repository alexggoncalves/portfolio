import { useLocation, useNavigate } from "react-router";

export const PAGE_FADE_MS = 150;

export default function usePageNavigate() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (to: string) => {
        if (to === pathname) return;

        // fade the page out, then navigate while it's invisible
        document.documentElement.classList.add("page-leaving");
        window.setTimeout(() => navigate(to), PAGE_FADE_MS);
    };
}