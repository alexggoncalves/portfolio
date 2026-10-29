import { useCallback, useSyncExternalStore } from "react";

export const MOBILE_QUERY = "(max-width: 700px)"

const useMediaQuery = (query: string) => {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        },
        [query],
    );

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
    );
};

export default useMediaQuery;
