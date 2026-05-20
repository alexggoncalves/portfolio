import { useCallback, useEffect, useRef } from "react";

const INERTIA_DECAY = 0.92;
const INERTIA_STOP = 0.5;
const DRAG_CLICK_SUPPRESS_PX = 14;
/** Horizontal distance from touch start before we treat the gesture as row pan (not page scroll). */
const COMMIT_HORIZONTAL_PX = 10;

function clampPan(
    viewport: HTMLDivElement,
    track: HTMLDivElement,
    pan: number,
): number {
    const maxScroll = Math.max(0, track.offsetWidth - viewport.clientWidth);
    return Math.max(-maxScroll, Math.min(0, pan));
}

function applyPan(track: HTMLDivElement, pan: number) {
    track.style.transform = `translate3d(${pan}px,0,0)`;
}

/**
 * Drag + inertia by translating an inner track. Use with `overflow: visible` on the
 * viewport so cards can extend past the row edges visually.
 */
function useHorizontalDragScroll() {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const rafId = useRef<number | null>(null);
    const unbindPointerRef = useRef<(() => void) | null>(null);

    const cancelInertia = useCallback(() => {
        if (rafId.current == null) return;
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
    }, []);

    useEffect(() => {
        return () => {
            cancelInertia();
            unbindPointerRef.current?.();
            unbindPointerRef.current = null;
        };
    }, [cancelInertia]);

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
            let velocity = 0;
            let dragPx = 0;

            let pan = 0;
            const transform = track.style.transform;
            const match = /translate(?:3d)?\((-?\d+(?:\.\d+)?)px/i.exec(transform);
            if (match) {
                const parsed = parseFloat(match[1]);
                if (!Number.isNaN(parsed)) pan = parsed;
            }

            pan = clampPan(viewport, track, pan);
            const panAtDown = pan;

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
                savedOverflowY = "";
            };

            const onMove = (ev: PointerEvent) => {
                if (ev.pointerId !== pointerId) return;
                const v = viewportRef.current;
                const t = trackRef.current;
                if (!v || !t) return;

                if (!committed) {
                    const totalDx = ev.clientX - startX;
                    const totalDy = ev.clientY - startY;
                    const horizontalIntent =
                        Math.abs(totalDx) >= COMMIT_HORIZONTAL_PX &&
                        Math.abs(totalDx) > Math.abs(totalDy);

                    if (!horizontalIntent) {
                        lastX = ev.clientX;
                        return;
                    }

                    committed = true;
                    lockVerticalScroll();
                    viewport.classList.add("dragging");
                    try {
                        viewport.setPointerCapture(pointerId);
                    } catch {
                        /* setPointerCapture can throw if pointerId is invalid */
                    }

                    pan = clampPan(v, t, panAtDown + totalDx);
                    applyPan(t, pan);
                    const dx0 = ev.clientX - lastX;
                    lastX = ev.clientX;
                    dragPx += Math.abs(dx0);
                    velocity = dx0;
                    ev.preventDefault();
                    return;
                }

                const dx = ev.clientX - lastX;
                lastX = ev.clientX;
                dragPx += Math.abs(dx);

                ev.preventDefault();

                pan += dx;
                pan = clampPan(v, t, pan);
                applyPan(t, pan);
                velocity = dx;
            };

            const onUp = (ev: PointerEvent) => {
                if (ev.pointerId !== pointerId) return;

                try {
                    if (viewport.hasPointerCapture(pointerId)) {
                        viewport.releasePointerCapture(pointerId);
                    }
                } catch {
                    /* ignore */
                }

                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
                document.removeEventListener("pointercancel", onUp);
                unbindPointerRef.current = null;

                unlockVerticalScroll();
                viewportRef.current?.classList.remove("dragging");

                if (dragPx >= DRAG_CLICK_SUPPRESS_PX) {
                    const swallow = (ce: MouseEvent) => {
                        if (!viewportRef.current?.contains(ce.target as Node))
                            return;
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
                if (
                    !committed ||
                    !vp ||
                    !tr ||
                    Math.abs(velocity) < INERTIA_STOP
                )
                    return;

                const step = () => {
                    const vpp = viewportRef.current;
                    const trr = trackRef.current;
                    if (!vpp || !trr || Math.abs(velocity) < INERTIA_STOP) {
                        rafId.current = null;
                        return;
                    }

                    pan += velocity;
                    pan = clampPan(vpp, trr, pan);
                    applyPan(trr, pan);

                    velocity *= INERTIA_DECAY;
                    rafId.current = requestAnimationFrame(step);
                };
                rafId.current = requestAnimationFrame(step);
            };

            unbindPointerRef.current = () => {
                try {
                    if (viewport.hasPointerCapture(pointerId)) {
                        viewport.releasePointerCapture(pointerId);
                    }
                } catch {
                    /* ignore */
                }
                unlockVerticalScroll();
                viewport.classList.remove("dragging");
                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
                document.removeEventListener("pointercancel", onUp);
            };

            document.addEventListener("pointermove", onMove, { passive: false });
            document.addEventListener("pointerup", onUp);
            document.addEventListener("pointercancel", onUp);
        },
        [cancelInertia],
    );

    return { viewportRef, trackRef, onPointerDown };
}

export default useHorizontalDragScroll;
