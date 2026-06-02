import { useState, useEffect } from "react";

function preloadImage(src: string) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
    });
}

export default function useImagePreloader(urls: string[]) {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {

        if (!urls.length) {
            setLoaded(true);
            setProgress(100);
            return;
        }

        let completed = 0;

        const promises = urls.map((url) =>
            preloadImage(url).finally(() => {
                completed++;
                setProgress(Math.round((completed / urls.length) * 100));
            }),
        );

        Promise.allSettled(promises).then(() => {
            setLoaded(true);
            setProgress(100);
        });
    }, []);

    return { loaded, progress };
}
