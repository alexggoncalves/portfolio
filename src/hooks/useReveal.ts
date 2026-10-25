import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    observer.disconnect(); // reveal once, stay visible
                }
            },
            { rootMargin: "0px 0px -10% 0px" }, // wait until it's a bit above the bottom edge
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, revealed };
}

export default useReveal;