import { useEffect, useRef } from "react";

const DRAG_THRESHOLD = 5;
const INERTIA_DECAY = 0.92;
const INERTIA_STOP = 0.5;

function useHorizontalDragScroll() {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLDivElement | null>(null);
    const rafId = useRef<number | null>(null);

    const stopInertia = () => {
        if (rafId.current != null) cancelAnimationFrame(rafId.current);
        rafId.current = null;
    };

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        // keep scroll indicator, sized to how much of the track is visible
        const update = () => {
            const el = indicatorRef.current;
            const bar = el?.parentElement;
            if (!el || !bar) return;

            const barWidth = bar.clientWidth;
            const { scrollLeft, scrollWidth, clientWidth } = viewport;
            const thumb = Math.max(barWidth * (clientWidth / scrollWidth), 10);
            const maxScroll = scrollWidth - clientWidth;
            const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

            el.style.width = `${thumb}px`;
            el.style.transform = `translateX(${progress * (barWidth - thumb)}px)`;
        };

        update();
        viewport.addEventListener("scroll", update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(viewport);
        if (trackRef.current) observer.observe(trackRef.current);

        return () => {
            viewport.removeEventListener("scroll", update);
            observer.disconnect();
            stopInertia();
        };
    }, []);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;

        const viewport = viewportRef.current;
        if (!viewport) return;

        stopInertia();

        const startX = e.clientX;
        const startScroll = viewport.scrollLeft;
        let lastX = e.clientX;
        let velocity = 0;
        let dragging = false;

        const onMove = (ev: PointerEvent) => {
            if (!dragging) {
                if (Math.abs(ev.clientX - startX) < DRAG_THRESHOLD) return;
                dragging = true;
                viewport.classList.add("dragging");
            }

            velocity = ev.clientX - lastX;
            lastX = ev.clientX;
            viewport.scrollLeft = startScroll - (ev.clientX - startX);
        };

        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("pointercancel", onUp);

            if (!dragging) return;
            viewport.classList.remove("dragging");

            // Block the click that fires after a drag
            // Removed right after in case the drag ended outside and no click fires
            const swallow = (ce: MouseEvent) => {
                ce.preventDefault();
                ce.stopPropagation();
            };
            window.addEventListener("click", swallow, {
                capture: true,
                once: true,
            });
            setTimeout(
                () => window.removeEventListener("click", swallow, true),
                0,
            );

            // Let track glide a bit after release
            const step = () => {
                velocity *= INERTIA_DECAY;
                if (Math.abs(velocity) < INERTIA_STOP) {
                    rafId.current = null;
                    return;
                }
                viewport.scrollLeft -= velocity;
                rafId.current = requestAnimationFrame(step);
            };
            rafId.current = requestAnimationFrame(step);
        };

        // Add events to window so the drag keeps working if the mouse leaves container
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
    };

    return { viewportRef, trackRef, indicatorRef, onPointerDown };
}

export default useHorizontalDragScroll;
