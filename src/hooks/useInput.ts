import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type { InteractiveElement } from "../components/elements/core/InteractiveElement";
import { useFrame } from "@react-three/fiber";

function useInput() {
    // ------ POINTER ------
    const pointerPosition = useRef<Vector2>(new Vector2(0));
    const isPointerInside = useRef<boolean>(false);
    const isPointerDown = useRef(false);
    const isDragging = useRef(false);

    const mouseDownPos = useRef(new Vector2());
    const clickTarget = useRef<InteractiveElement | null>(null);

    const DRAG_THRESHOLD = 5;

    // ------ SCROLL ------
    const scroll = useRef(0);
    const scrollVelocity = useRef(0);
    const targetScrollVelocity = useRef(0);
    const isScrolling = useRef(false);

    const isTouching = useRef(false);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const lastTouchY = useRef(0);
    const lastTouchX = useRef(0);

    // ------ CURSOR ------
    const lastCursor = useRef<string>("default");
    const cursorDirty = useRef(false);

    const setClickTarget = (el: InteractiveElement | null) => {
        clickTarget.current = el;
    };

    const updateCursor = () => {
        let next = "default";

        if (false) next = "w-resize";
        else if (clickTarget.current?.hasPointerOnHover) next = "pointer";

        if (lastCursor.current !== next) {
            document.body.style.cursor = next;
            lastCursor.current = next;
        }
    };

    // ------- EVENTS -------------
    useEffect(() => {
        const setPosition = (x: number, y: number) => {
            pointerPosition.current.set(x, y);
        };

        const start = (x: number, y: number) => {
            isPointerDown.current = true;
            isDragging.current = false;
            mouseDownPos.current.set(x, y);
        };

        const move = (x: number, y: number) => {
            setPosition(x, y);
            cursorDirty.current = true;

            if (!isPointerDown.current) return;

            const dx = x - mouseDownPos.current.x;
            const dy = y - mouseDownPos.current.y;
            if (
                Math.abs(dx) > DRAG_THRESHOLD ||
                Math.abs(dy) > DRAG_THRESHOLD
            ) {
                isDragging.current = true;
            }
        };

        const end = () => {
            // If it was not a drag, trigger onClick function on current target
            if (isPointerDown.current && !isDragging.current) {
                clickTarget.current?.onClick?.();
            }

            // Reset state
            isPointerDown.current = false;
            isDragging.current = false;
        };

        // Mouse events
        const onMouseDown = (e: MouseEvent) => start(e.clientX, e.clientY);
        const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
        const onMouseUp = () => end();

        // Touch events
        const onTouchStart = (e: TouchEvent) => {
            const t = e.touches[0];

            touchStartX.current = t.clientX;
            touchStartY.current = t.clientY;

            lastTouchX.current = t.clientX;
            lastTouchY.current = t.clientY;

            isScrolling.current = false;

            start(t.clientX, t.clientY);
        };
        const onTouchMove = (e: TouchEvent) => {
            const t = e.touches[0];
            const dx = Math.abs(t.clientX - touchStartX.current);
            const dy = Math.abs(t.clientY - touchStartY.current);

            if (dy > dx) {
                const delta = lastTouchY.current - t.clientY;
                targetScrollVelocity.current += delta * 0.003;
                isScrolling.current = true;
            }

            lastTouchX.current = t.clientX;
            lastTouchY.current = t.clientY;

            move(t.clientX, t.clientY);
        };
        const onTouchEnd = () => {
            isScrolling.current = false;
            end();
        };

        // Scroll event
        const onWheel = (e: WheelEvent) => {
            targetScrollVelocity.current += e.deltaY * 0.0015;
        };

        // Window focus/blur events
        const onLeave = () => {
            isPointerInside.current = false;
            setPosition(-1, -1);
        };
        const onEnter = () => {
            isPointerInside.current = true;
        };

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchstart", onTouchStart);
        window.addEventListener("touchmove", onTouchMove);
        window.addEventListener("touchend", onTouchEnd);
        window.addEventListener("wheel", onWheel);
        window.addEventListener("blur", onLeave);
        window.addEventListener("focus", onEnter);

        return () => {
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("blur", onLeave);
            window.removeEventListener("focus", onEnter);
        };
    }, []);

    // ---- UPDATE SCROLL PHYSICS ----
    useFrame(() => {
        const hasActivity =
            !isTouching.current ||
            isScrolling.current ||
            Math.abs(scrollVelocity.current) > 0.001 ||
            Math.abs(targetScrollVelocity.current) > 0.001;

        if (hasActivity) {
            scrollVelocity.current +=
                (targetScrollVelocity.current - scrollVelocity.current) * 0.18;

            scroll.current += scrollVelocity.current;

            targetScrollVelocity.current *= 0.9;

            if (Math.abs(scrollVelocity.current) < 0.001)
                scrollVelocity.current = 0;

            if (Math.abs(targetScrollVelocity.current) < 0.001)
                targetScrollVelocity.current = 0;
        }

        // cursor update (batched, not event-driven)
        if (cursorDirty.current) {
            updateCursor();
            cursorDirty.current = false;
        }
    }, -2);

    return {
        pointerPosition,
        isPointerInside,
        isPointerDown,
        clickTarget,
        scrollVelocity,
        setClickTarget,
        updateCursor,
    };
}

export default useInput;
