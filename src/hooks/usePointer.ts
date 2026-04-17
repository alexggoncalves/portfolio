import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import type { InteractiveElement } from "../components/elements/core/InteractiveElement";

function usePointer() {
    const pointerPosition = useRef<Vector2>(new Vector2(0));
    const isMouseInside = useRef<boolean>(false);
    const isMouseDown = useRef(false);

    const DRAG_THRESHOLD = 5;
    const mouseDownPos = useRef<Vector2 | null>(null);
    const isDragging = useRef(false);

    const clickTarget = useRef<InteractiveElement | null>(null);

    // const { isDraggingHorizontally } = useCursorStore();

    const lastCursor = useRef<string>("default");

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

    useEffect(() => {
        const updatePosition = (x: number, y: number) => {
            pointerPosition.current.set(x, y);
        };

        const handleMouseMove = (e: MouseEvent) => {
            updatePosition(e.clientX, e.clientY);

            if (!mouseDownPos.current) return;

            const horizontalDistance = e.clientX - mouseDownPos.current.x;

            if (Math.abs(horizontalDistance) > DRAG_THRESHOLD) {
                isDragging.current = true;
            }
        };

        const handleMouseOut = () => {
            isMouseInside.current = false;
            updatePosition(-1, -1);
        };

        const handleMouseIn = () => {
            isMouseInside.current = true;
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (!mouseDownPos.current) {
                mouseDownPos.current = new Vector2();
            }
            mouseDownPos.current.set(e.clientX, e.clientY);
            isMouseDown.current = true;
            isDragging.current = false;
        };

        const handleMouseUp = () => {
            if (!mouseDownPos.current) return;
            isMouseDown.current = false;

            if (!isDragging.current) {
                if (clickTarget.current) clickTarget.current.onClick();
            }

            mouseDownPos.current = null;

            isDragging.current = false;
        };

        window.addEventListener("mouseleave", handleMouseOut);
        window.addEventListener("mouseenter", handleMouseIn);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mouseleave", handleMouseOut);
            window.removeEventListener("mouseenter", handleMouseIn);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return {
        pointerPosition,
        isMouseInside,
        clickTarget,
        isMouseDown,
        setClickTarget,
        updateCursor
    };
}

export default usePointer;
