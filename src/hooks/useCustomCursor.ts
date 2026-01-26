import { useEffect, useState } from "react";

function useCustomCursor() {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [cursorState, setCursorState] = useState<"default" | "pointer">(
        "default",
    );
    const [cursorEnabled, setCursorEnabled] = useState(true);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseLeave = () => {
            setCursorEnabled(false);
        };

        const handleMouseEnter = () => {
            setCursorEnabled(true);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseout", handleMouseLeave);
        window.addEventListener("mouseover", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseout", handleMouseLeave);
            window.removeEventListener("mouseover", handleMouseEnter);
        };
    }, []);

    return { cursorPosition, cursorState, setCursorState, cursorEnabled };
}

export default useCustomCursor;
