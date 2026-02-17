import { useEffect, useRef } from "react";
import { Vector2 } from "three";

function usePointer() {
    const mousePosition = useRef<Vector2>(new Vector2(0));
    const isMouseInside = useRef<boolean>(false);

    useEffect(() => {
        const updatePosition = (x: number, y: number) => {
            mousePosition.current = new Vector2(x, y);
        };
        // WHEEL SCROLL
        const onMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            updatePosition(e.clientX, e.clientY);
        };

        const handleMouseLeave = () => {
            isMouseInside.current = false;
            updatePosition(-1, -1);
        };

        const handleMouseEnter = () => {
            isMouseInside.current = true;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseout", handleMouseLeave);
        window.addEventListener("mouseover", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            window.removeEventListener("mouseover", handleMouseEnter);
        };
    }, []);

    return { mousePosition, isMouseInside };
}

export default usePointer;
