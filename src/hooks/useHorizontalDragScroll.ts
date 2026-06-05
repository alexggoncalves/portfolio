import { useCallback, useEffect, useRef } from "react";

const INERTIA_DECAY = 0.92;
const INERTIA_STOP = 0.5;
const DRAG_THRESHOLD = 14;
const HORIZONTAL_SCROLL_THRESHOLD = 10;

function clampPan(
    viewport: HTMLDivElement,
    track: HTMLDivElement,
    pan: number,
): number {
    const maxScroll = Math.max(0, track.offsetWidth - viewport.clientWidth);
    return Math.max(-maxScroll, Math.min(0, pan));
}

function applyPan(track: HTMLDivElement, pan: number) {
    track.style.transform = `translateX(${pan}px)`;
}

function useHorizontalDragScroll({
    onDragStateChange,
}: {
    onDragStateChange?: (dragging: boolean) => void;
} = {}) {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const indicatorRef = useRef<HTMLDivElement | null>(null);

    const rafId = useRef<number | null>(null);
    const unbindPointerRef = useRef<(() => void) | null>(null);

    const panRef = useRef(0);
    const velocityRef = useRef(0);

    const layoutRef = useRef({
        containerWidth: 0,
        thumbWidth: 0,
        maxX: 0,
        maxScroll: 0,
    });

    const cancelInertia = useCallback(() => {
        if (rafId.current != null) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }
        velocityRef.current = 0;
    }, []);

    useEffect(() => {
        return () => {
            cancelInertia();
            unbindPointerRef.current?.();
        };
    }, [cancelInertia]);

    // resize indicator
    useEffect(() => {
        const resizeIndicator = () => {
            const viewport = viewportRef.current;
            const track = trackRef.current;
            const el = indicatorRef.current;

            if (!viewport || !track || !el) return;

            const containerWidth = 100;

            const ratio = viewport.clientWidth / track.offsetWidth;
            const thumbWidth = Math.max(containerWidth * ratio, 10);

            const maxX = containerWidth - thumbWidth;
            const maxScroll = Math.max(
                0,
                track.offsetWidth - viewport.clientWidth,
            );

            layoutRef.current = {
                containerWidth,
                thumbWidth,
                maxX,
                maxScroll,
            };

            el.style.width = `${thumbWidth}px`;
        };

        resizeIndicator();
        window.addEventListener("resize", resizeIndicator);
        return () => window.removeEventListener("resize", resizeIndicator);
    }, []);

    function updateIndicator(pan: number) {
        const el = indicatorRef.current;
        if (!el) return;

        const { maxScroll, maxX } = layoutRef.current;
        const progress = maxScroll === 0 ? 0 : Math.abs(pan) / maxScroll;
        const x = progress * maxX;

        el.style.transform = `translate(${x}px,0)`;
    }

    const onPointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (e.button !== 0) return;
            const viewport = viewportRef.current;
            const track = trackRef.current;

            if (!viewport?.contains(e.target as Node) || !track) return;

            unbindPointerRef.current?.();
            cancelInertia();

            const pointerId = e.pointerId;

            const startX = e.clientX;
            const startY = e.clientY;

            let lastX = e.clientX;
            let dragPx = 0;

            let committed = false;

            let scrollLockEl: HTMLElement | null = null;
            let savedOverflowY = "";

            const lockVerticalScroll = () => {
                if (scrollLockEl) return;
                const mainEl = viewport.closest("main");
                if (!mainEl) return;

                scrollLockEl = mainEl;
                savedOverflowY = mainEl.style.overflowY;
                mainEl.style.overflowY = "hidden";
            };

            const unlockVerticalScroll = () => {
                if (!scrollLockEl) return;
                scrollLockEl.style.overflowY = savedOverflowY;
                scrollLockEl = null;
            };

            const onMove = (ev: PointerEvent) => {
                if (ev.pointerId !== pointerId) return;

                const v = viewportRef.current;
                const t = trackRef.current;
                if (!v || !t) return;

                const dxTotal = ev.clientX - startX;
                const dyTotal = ev.clientY - startY;

                if (!committed) {
                    const horizontalIntent =
                        Math.abs(dxTotal) >= HORIZONTAL_SCROLL_THRESHOLD &&
                        Math.abs(dxTotal) > Math.abs(dyTotal);

                    if (!horizontalIntent) {
                        lastX = ev.clientX;
                        return;
                    }

                    committed = true;
                    onDragStateChange?.(true);
                    lockVerticalScroll();
                    viewport.classList.add("dragging");

                    try {
                        viewport.setPointerCapture(pointerId);
                    } catch {}

                    ev.preventDefault();
                }

                const dx = ev.clientX - lastX;
                lastX = ev.clientX;

                dragPx += Math.abs(dx);

                const nextPan = clampPan(v, t, panRef.current + dx);

                panRef.current = nextPan;
                applyPan(t, nextPan);
                updateIndicator(nextPan);

                velocityRef.current = dx;

                ev.preventDefault();
            };

            const onUp = (ev: PointerEvent) => {
                if (ev.pointerId !== pointerId) return;

                onDragStateChange?.(false);

                try {
                    if (viewport.hasPointerCapture(pointerId)) {
                        viewport.releasePointerCapture(pointerId);
                    }
                } catch {}

                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
                document.removeEventListener("pointercancel", onUp);

                unbindPointerRef.current = null;

                unlockVerticalScroll();
                viewport.classList.remove("dragging");

                if (dragPx >= DRAG_THRESHOLD) {
                    const swallow = (ce: MouseEvent) => {
                        if (!viewport.contains(ce.target as Node)) return;
                        ce.preventDefault();
                        ce.stopPropagation();
                    };

                    document.addEventListener("click", swallow, {
                        capture: true,
                        once: true,
                    });
                }

                const vp = viewportRef.current;
                const tr = trackRef.current;

                if (!vp || !tr || Math.abs(velocityRef.current) < INERTIA_STOP)
                    return;

                const step = () => {
                    const vpp = viewportRef.current;
                    const trr = trackRef.current;

                    if (!vpp || !trr) {
                        rafId.current = null;
                        return;
                    }

                    const velocity = velocityRef.current;

                    if (Math.abs(velocity) < INERTIA_STOP) {
                        rafId.current = null;
                        velocityRef.current = 0;
                        return;
                    }

                    let pan = panRef.current + velocity;
                    pan = clampPan(vpp, trr, pan);

                    panRef.current = pan;
                    velocityRef.current *= INERTIA_DECAY;

                    applyPan(trr, pan);
                    updateIndicator(pan);

                    rafId.current = requestAnimationFrame(step);
                };

                rafId.current = requestAnimationFrame(step);
            };

            unbindPointerRef.current = () => {
                try {
                    if (viewport.hasPointerCapture(pointerId)) {
                        viewport.releasePointerCapture(pointerId);
                    }
                } catch {}

                unlockVerticalScroll();
                onDragStateChange?.(false);
                viewport.classList.remove("dragging");

                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
                document.removeEventListener("pointercancel", onUp);
            };

            document.addEventListener("pointermove", onMove, {
                passive: false,
            });
            document.addEventListener("pointerup", onUp);
            document.addEventListener("pointercancel", onUp);
        },
        [cancelInertia],
    );

    return { viewportRef, trackRef, onPointerDown, indicatorRef };
}

export default useHorizontalDragScroll;
