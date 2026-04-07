import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import useCursorStore from "../stores/pointerStore";
import type { InteractiveElement } from "../components/elements/InteractiveElement";

function usePointer() {
    const pointerPosition = useRef<Vector2>(new Vector2(0));
    const isMouseInside = useRef<boolean>(false);
    const isMouseDown = useRef(false);

    const DRAG_THRESHOLD = 5;
    const mouseDownPos = useRef<Vector2 | null>(null);
    const isDragging = useRef(false);

    const clickTarget = useRef<InteractiveElement | null>(null);
    const hoverCount = useCursorStore((s) => s.hoverCount);
    const isDraggingHorizontally = useCursorStore(
        (s) => s.isDraggingHorizontally,
    );

    useEffect(() => {
        if (isDraggingHorizontally) {
            document.body.style.cursor = "w-resize";
        } else if (hoverCount > 0) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    }, [hoverCount, isDraggingHorizontally]);

    useEffect(() => {
        const updatePosition = (x: number, y: number) => {
            pointerPosition.current = new Vector2(x, y);
        };

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
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
            mouseDownPos.current = new Vector2(e.clientX, e.clientY);
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

        window.addEventListener("mouseout", handleMouseOut);
        window.addEventListener("mouseover", handleMouseIn);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mouseout", handleMouseOut);
            window.removeEventListener("mouseover", handleMouseIn);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return { pointerPosition, isMouseInside, clickTarget, isMouseDown };
}

export default usePointer;
