import { useEffect, useRef } from "react";
import { Vector2 } from "three";
import useCursorStore from "../stores/cursorStore";

function usePointer() {
    const mousePosition = useRef<Vector2>(new Vector2(0));
    const isMouseInside = useRef<boolean>(false);

    const hoverCount = useCursorStore((s) => s.hoverCount);

    useEffect(() => {
        if(hoverCount > 0) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    }, [hoverCount]);

    useEffect(() => {
        const updatePosition = (x: number, y: number) => {
            mousePosition.current = new Vector2(x, y);
        };

        const onMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            updatePosition(e.clientX, e.clientY);
        };

        const handleMouseOut = () => {
            isMouseInside.current = false;
            updatePosition(-1, -1);
        };

        const handleMouseIn = () => {
            isMouseInside.current = true;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseout", handleMouseOut);
        window.addEventListener("mouseover", handleMouseIn);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseout", handleMouseOut);
            window.removeEventListener("mouseover", handleMouseIn);
        };
    }, []);

    return { mousePosition, isMouseInside };
}

export default usePointer;
